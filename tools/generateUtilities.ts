/**
 * Generate utility functions (type guards and property extractors) from schema catalog
 * This script analyzes the schema catalog and generates TypeScript utility functions
 */

import fs from 'fs'
import path from 'path'
import {
  getDirname,
  loadSchemaIndex,
  getSingularTypeName,
  capitalize,
} from './generatorUtils.js'

const __dirname = getDirname(import.meta.url)
const schemaIndex = loadSchemaIndex(__dirname)

interface PropertyInfo {
  schemas: string[]
  type: string
  required: boolean
}

// Analyze all schemas to find common properties
function analyzeSchemas(): Map<string, PropertyInfo> {
  const propertyMap = new Map<string, PropertyInfo>()

  for (const schemaEntry of schemaIndex.schemas) {
    const schemaPath = path.join(__dirname, '..', schemaEntry.schemaFile)
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))

    // Get properties from the schema
    const properties = schema.items?.properties || {}
    const required = schema.items?.required || []

    // Track which schemas have which properties
    for (const [propName, propDef] of Object.entries(properties)) {
      if (!propertyMap.has(propName)) {
        propertyMap.set(propName, {
          schemas: [],
          type:
            (propDef as { type?: string }).type ||
            (propDef as { $ref?: string }).$ref ||
            'unknown',
          required: false,
        })
      }

      const info = propertyMap.get(propName)!
      info.schemas.push(schemaEntry.id)
      if (required.includes(propName)) {
        info.required = true
      }
    }
  }

  return propertyMap
}

// Get actual required fields from schema file (not just from index)
function getActualRequiredFields(schemaId: string): string[] {
  const schemaPath = path.join(
    __dirname,
    '..',
    `schemas/${schemaId}.schema.json`
  )
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))

  // Get required fields from items.required or items definition
  let required = schema.items?.required || []

  // If the schema uses a $ref, we need to look up the definition
  if (schema.items?.$ref && typeof schema.items.$ref === 'string') {
    // Parse the $ref to get the file and definition path
    // Example: "shared/objects.schema.json#/definitions/system"
    const refParts = schema.items.$ref.split('#')
    const refFile = refParts[0]
    const refPath = refParts[1]

    // Load the referenced schema file
    const refSchemaPath = path.join(__dirname, '..', 'schemas', refFile)
    const refSchema = JSON.parse(fs.readFileSync(refSchemaPath, 'utf-8'))

    // Navigate to the definition
    const pathParts = refPath.split('/').filter((p: string) => p)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let definition: any = refSchema
    for (const part of pathParts) {
      definition = definition[part]
    }

    // Get required fields from the definition
    required = definition?.required || []
  }

  // Filter out base fields that all entities have (from entry definition)
  const baseFields = ['id', 'name', 'page', 'source']
  return required.filter((field: string) => !baseFields.includes(field))
}

// Generate type guard functions
function generateTypeGuards(): string {
  const guards: string[] = []

  for (const schemaEntry of schemaIndex.schemas) {
    const schemaName = schemaEntry.id
    const singularName = getSingularTypeName(schemaName)
    const typeName = `SURef${singularName}`

    // Get actual required fields (excluding base fields)
    const requiredFields = getActualRequiredFields(schemaName)

    guards.push(`
/**
 * Type guard to check if an entity is a ${singularName}
 * Checks if the entity has the required fields for the '${schemaName}' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the ${singularName} type
 */
export function is${singularName}(entity: SURefEntity): entity is ${typeName} {
  if (!entity || typeof entity !== 'object') return false
  ${generateRequiredFieldsCheck(requiredFields)}
  return true
}`)
  }

  return guards.join('\n')
}

// Generate required fields check for type guard
function generateRequiredFieldsCheck(requiredFields: string[]): string {
  if (!requiredFields || requiredFields.length === 0) {
    return '// No required fields to check'
  }
  return requiredFields
    .map((field) => `if (!('${field}' in entity)) return false`)
    .join('\n  ')
}

// Generate property extractor functions
function generatePropertyExtractors(
  propertyMap: Map<string, PropertyInfo>
): string {
  const extractors: string[] = []

  // Generate extractors for properties that appear in multiple schemas
  // Filter to properties that are useful for extraction (not id, name, source, description)
  const skipProperties = new Set(['id', 'name', 'source', 'description'])
  const targetProperties = Array.from(propertyMap.keys()).filter(
    (prop) =>
      !skipProperties.has(prop) && propertyMap.get(prop)!.schemas.length > 1
  )

  for (const propName of targetProperties) {
    const info = propertyMap.get(propName)
    if (!info) continue

    const functionName = `get${propName.charAt(0).toUpperCase()}${propName.slice(1)}`
    // Handle different type formats
    let returnType = 'unknown'
    if (info.type === 'integer' || info.type === 'number') {
      returnType = 'number'
    } else if (info.type === 'string') {
      returnType = 'string'
    } else if (info.type === 'boolean') {
      returnType = 'boolean'
    }
    // If type is a $ref, use 'unknown' as we can't resolve it to a TS type easily

    extractors.push(`
/**
 * Extract ${propName} from an entity if it exists
 * Supported schemas: ${info.schemas.join(', ')}
 * @param entity - The entity to extract from
 * @returns The ${propName} value or undefined
 */
export function ${functionName}(entity: SURefEntity): ${returnType} | undefined {
  return '${propName}' in entity ? (entity as unknown as Record<string, ${returnType}>).${propName} : undefined
}`)
  }

  // Special case for page reference (it's called 'page' in the schema)
  extractors.push(`
/**
 * Extract page reference from an entity
 * All entities have a page reference from the entry definition
 * @param entity - The entity to extract from
 * @returns The page number or undefined
 */
export function getPageReference(entity: SURefEntity): number | undefined {
  return 'page' in entity ? (entity as unknown as Record<string, number>).page : undefined
}`)

  return extractors.join('\n')
}

// Generate the utilities file
function generateUtilitiesFile() {
  console.log('🔧 Generating utility functions from schema catalog...\n')

  const propertyMap = analyzeSchemas()

  console.log('📊 Property analysis:')
  for (const [propName, info] of propertyMap.entries()) {
    if (['techLevel', 'page', 'salvageValue'].includes(propName)) {
      console.log(`   ${propName}: ${info.schemas.length} schemas`)
    }
  }
  console.log()

  const typeGuards = generateTypeGuards()
  const propertyExtractors = generatePropertyExtractors(propertyMap)

  // Auto-generate type imports from schema catalog
  const typeImports = schemaIndex.schemas
    .map((entry: any) => {
      const singularName = getSingularTypeName(entry.id)
      return `  SURef${singularName}`
    })
    .join(',\n')

  const output = `/**
 * Auto-generated utility functions for Salvage Union entities
 * Generated from schema catalog
 * DO NOT EDIT MANUALLY - Run 'npm run generate:utilities' to regenerate
 */

import type { SURefEntity } from './index.js'
import type {
${typeImports},
} from './types/generated.js'

// ============================================================================
// TYPE GUARDS
// ============================================================================
${typeGuards}

// ============================================================================
// PROPERTY EXTRACTORS
// ============================================================================
${propertyExtractors}
`

  const outputPath = path.join(__dirname, '../lib/utilities.ts')
  fs.writeFileSync(outputPath, output, 'utf-8')

  console.log('✅ Utilities generated successfully!')
  console.log(`📄 Output: ${outputPath}\n`)
}

// Run the generator
generateUtilitiesFile()
