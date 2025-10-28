#!/usr/bin/env tsx

/**
 * Generate TypeScript types from JSON Schema files
 * Uses json-schema-to-typescript to create clean, schema-based types
 *
 * Strategy:
 * 1. Generate shared types from definitions in shared schemas
 * 2. Generate main schema types
 * 3. Deduplicate and clean up output
 */

import { compile, type JSONSchema } from 'json-schema-to-typescript'
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
} from 'fs'
import { join } from 'path'

const SCHEMAS_DIR = join(process.cwd(), 'schemas')
const SHARED_DIR = join(SCHEMAS_DIR, 'shared')
const OUTPUT_DIR = join(process.cwd(), 'lib', 'types')
const OUTPUT_FILE = join(OUTPUT_DIR, 'schema-generated.ts')

// Track generated type names to avoid duplicates
const generatedTypes = new Set<string>()

interface SchemaDefinition {
  name: string
  path: string
  typeName: string
}

/**
 * Get all schema files to process
 */
function getSchemaFiles(): SchemaDefinition[] {
  const schemaFiles = readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith('.schema.json') && f !== 'index.json')
    .map((f) => {
      const name = f.replace('.schema.json', '')
      const typeName = toTypeName(name)
      return {
        name,
        path: join(SCHEMAS_DIR, f),
        typeName,
      }
    })

  return schemaFiles
}

/**
 * Get shared schema definitions
 */
function getSharedSchemas(): SchemaDefinition[] {
  return [
    {
      name: 'common',
      path: join(SHARED_DIR, 'common.schema.json'),
      typeName: 'Common',
    },
    {
      name: 'enums',
      path: join(SHARED_DIR, 'enums.schema.json'),
      typeName: 'Enums',
    },
    {
      name: 'objects',
      path: join(SHARED_DIR, 'objects.schema.json'),
      typeName: 'Objects',
    },
  ]
}

/**
 * Convert schema name to TypeScript type name
 */
function toTypeName(schemaName: string): string {
  // Handle special cases
  if (schemaName.includes('.')) {
    const [prefix, suffix] = schemaName.split('.')
    return toPascalCase(suffix) + toPascalCase(prefix)
  }

  return toPascalCase(schemaName)
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Resolve $ref in a schema by loading the referenced schema
 */
function resolveRefs(schema: unknown, basePath: string): JSONSchema {
  if (typeof schema !== 'object' || schema === null) {
    return schema as JSONSchema
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => resolveRefs(item, basePath)) as JSONSchema
  }

  const resolved: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(schema)) {
    if (key === '$ref' && typeof value === 'string') {
      // Parse the $ref
      const [filePath, defPath] = value.split('#')
      if (filePath) {
        // Load the referenced file
        let refFilePath = join(basePath, filePath)

        // If the file doesn't exist, it might be a shared schema referenced from another shared schema
        // Try looking in the shared directory
        if (!existsSync(refFilePath)) {
          refFilePath = join(SHARED_DIR, filePath)
        }

        const refSchema = JSON.parse(readFileSync(refFilePath, 'utf-8'))
        const newBasePath = join(refFilePath, '..')

        // Navigate to the definition
        if (defPath) {
          const parts = defPath.split('/').filter(Boolean)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let def: any = refSchema
          for (const part of parts) {
            def = def[part]
          }
          return resolveRefs(def, newBasePath)
        }
        return resolveRefs(refSchema, newBasePath)
      }
    } else {
      resolved[key] = resolveRefs(value, basePath)
    }
  }
  return resolved as JSONSchema
}

/**
 * Compile shared definitions from a schema file
 */
async function compileSharedDefinitions(
  schemaPath: string,
  schemaName: string
): Promise<string> {
  try {
    const schemaContent = JSON.parse(readFileSync(schemaPath, 'utf-8'))
    if (!schemaContent.definitions) {
      return ''
    }

    const basePath = join(schemaPath, '..')
    let output = ''

    for (const [defName, defSchema] of Object.entries(
      schemaContent.definitions
    )) {
      const typeName = toPascalCase(defName)

      // Skip if already generated
      if (generatedTypes.has(typeName)) {
        continue
      }

      // Resolve all $refs in this definition
      const resolvedSchema = resolveRefs(defSchema, basePath)

      const typeCode = await compile(resolvedSchema, typeName, {
        bannerComment: '',
        unreachableDefinitions: true,
        additionalProperties: false,
      })

      generatedTypes.add(typeName)
      output += typeCode + '\n'
    }
    return output
  } catch (error) {
    console.error(
      `❌ Error compiling shared definitions from ${schemaName}:`,
      error
    )
    return `// Error compiling ${schemaName}\n`
  }
}

/**
 * Compile a main schema file to TypeScript
 */
async function compileMainSchema(schema: SchemaDefinition): Promise<string> {
  try {
    const schemaContent = JSON.parse(readFileSync(schema.path, 'utf-8'))
    const basePath = join(schema.path, '..')

    // For array schemas, compile the items schema
    if (schemaContent.type === 'array' && schemaContent.items) {
      const finalItemTypeName = schema.typeName.replace(/List$/, '')

      // Check if this type was already generated (e.g., as a shared definition)
      if (generatedTypes.has(finalItemTypeName)) {
        // Just create the array type alias
        return `\nexport type ${schema.typeName} = ${finalItemTypeName}[]\n`
      }

      // Use a temporary name for the item type, then rename it
      const itemTypeName = finalItemTypeName + 'Item'

      // Resolve all $refs in the items schema
      const resolvedItems = resolveRefs(schemaContent.items, basePath)

      const typeCode = await compile(resolvedItems, itemTypeName, {
        bannerComment: '',
        unreachableDefinitions: true,
        additionalProperties: false,
      })

      // Extract only the main type, filter out duplicates, and rename
      const cleanedCode = removeDuplicateTypes(typeCode).replace(
        new RegExp(`\\b${itemTypeName}\\b`, 'g'),
        finalItemTypeName
      )

      // Mark this type as generated
      generatedTypes.add(finalItemTypeName)

      const arrayType = `\nexport type ${schema.typeName} = ${finalItemTypeName}[]\n`

      return cleanedCode + arrayType
    }

    // For non-array schemas, compile directly
    const resolvedSchema = resolveRefs(schemaContent, basePath)
    const typeCode = await compile(resolvedSchema, schema.typeName, {
      bannerComment: '',
      unreachableDefinitions: true,
      additionalProperties: false,
    })

    generatedTypes.add(schema.typeName)
    return removeDuplicateTypes(typeCode)
  } catch (error) {
    console.error(`❌ Error compiling ${schema.name}:`, error)
    return `// Error compiling ${schema.name}\n`
  }
}

/**
 * Remove duplicate type definitions that were already generated
 */
function removeDuplicateTypes(typeCode: string): string {
  const lines = typeCode.split('\n')
  const output: string[] = []
  let skipUntilNextExport = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if this is an export line
    if (
      line.startsWith('export type ') ||
      line.startsWith('export interface ')
    ) {
      const match = line.match(/export (?:type|interface) (\w+)/)
      if (match) {
        const typeName = match[1]
        if (generatedTypes.has(typeName)) {
          // Skip this type definition
          skipUntilNextExport = true
          continue
        }
      }
      skipUntilNextExport = false
    }

    if (!skipUntilNextExport) {
      output.push(line)
    }
  }

  return output.join('\n')
}

/**
 * Generate all types
 */
async function generateTypes() {
  console.log('🔧 Generating TypeScript types from JSON Schemas...\n')

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true })

  let output = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from JSON Schema files
 * Run 'bun run generate:types' to regenerate
 */

`

  // Step 1: Generate shared definitions first (these will be referenced by main schemas)
  console.log('📦 Generating shared type definitions...')
  const sharedSchemas = getSharedSchemas()

  output += `// ============================================\n`
  output += `// Shared Type Definitions\n`
  output += `// ============================================\n\n`

  for (const schema of sharedSchemas) {
    console.log(`   - ${schema.name}`)
    const typeCode = await compileSharedDefinitions(schema.path, schema.name)
    if (typeCode.trim()) {
      output += typeCode + '\n'
    }
  }

  // Step 2: Generate main schema types (duplicates will be filtered out)
  console.log('\n📋 Generating main schema types...')
  const schemas = getSchemaFiles()
  for (const schema of schemas) {
    console.log(`   - ${schema.name}`)
    const typeCode = await compileMainSchema(schema)
    output += `\n// ============================================\n`
    output += `// ${schema.typeName}\n`
    output += `// ============================================\n\n`
    output += typeCode + '\n'
  }

  // Step 3: Add utility types
  output += `\n// ============================================\n`
  output += `// Utility Types\n`
  output += `// ============================================\n\n`

  output += `// Action type - all actions reference the same schema definition\n`
  output += `export type SURefActionMeta = Action\n\n`

  output += `// Trait type - all traits reference the same schema definition\n`
  output += `export type SURefTraitMeta = Traits[number]\n\n`

  output += `// Table type - union of all table types\n`
  output += `export type SURefTableMeta = Table\n\n`

  // Write output file
  writeFileSync(OUTPUT_FILE, output)
  console.log(`\n✅ Generated ${OUTPUT_FILE}`)
  console.log(`📊 Processed ${sharedSchemas.length + schemas.length} schemas`)
  console.log(`🎯 Generated ${generatedTypes.size} unique types`)
}

// Run the generator
generateTypes().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
