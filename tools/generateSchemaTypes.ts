import { compile, JSONSchema } from 'json-schema-to-typescript'
import * as fs from 'fs'
import * as path from 'path'
import { SCHEMA_NAME_MAP } from './schemaNameMap.js'
import { getDirname, capitalize } from './generatorUtils.js'

/**
 * Generate TypeScript types from JSON Schema files
 *
 * Naming conventions:
 * - All types prefixed with SURef
 * - objects.schema definitions: SURefMeta<SingularName> (e.g., SURefMetaDamage)
 * - Main schema types: SURef<SingularName> (e.g., SURefAbility)
 * - Arrays: SURef<PluralName>List (e.g., SURefAbilityList)
 */

const __dirname = getDirname(import.meta.url)
const SCHEMAS_DIR = path.join(__dirname, '../schemas')
const SHARED_DIR = path.join(SCHEMAS_DIR, 'shared')
const OUTPUT_FILE = path.join(__dirname, '../lib/types/generated.ts')

// Map of inline enum patterns to their SURef type names
// This is used to replace inlined enum values with type references
interface EnumPattern {
  // The exact inline pattern to match (as a string for exact matching)
  pattern: string
  // The SURef type name to replace it with
  typeName: string
  // Whether this is an array type
  isArray?: boolean
}

/**
 * Build enum patterns from the enums.schema.json file
 *
 * This function automatically discovers all enum definitions and creates
 * patterns for replacing inlined enum values with type references.
 *
 * HOW IT WORKS:
 * 1. Scans enums.schema.json for all enum definitions
 * 2. For each enum, creates a pattern matching how json-schema-to-typescript
 *    inlines the values (e.g., "val1" | "val2" | "val3")
 * 3. Maps each pattern to its SURef type name (e.g., SURefActionType)
 *
 * AUTOMATIC EXPANSION:
 * When you add a new enum to enums.schema.json and reference it via $ref
 * in any schema, this function will automatically:
 * - Detect the new enum
 * - Create a replacement pattern for it
 * - Replace all inlined occurrences with the type reference
 *
 * No manual updates needed!
 */
function getEnumPatterns(): EnumPattern[] {
  const enumsSchemaPath = path.join(SHARED_DIR, 'enums.schema.json')
  const enumsSchema = JSON.parse(fs.readFileSync(enumsSchemaPath, 'utf8'))

  const patterns: EnumPattern[] = []

  for (const [defName, defSchema] of Object.entries(
    enumsSchema.definitions || {}
  )) {
    const typeName = `SURef${capitalize(defName)}`
    const schema = defSchema as { enum?: string[] }

    if (schema.enum && Array.isArray(schema.enum)) {
      // Create the inline pattern that json-schema-to-typescript generates
      const inlinePattern = schema.enum.map((value) => `"${value}"`).join(' | ')

      patterns.push({
        pattern: inlinePattern,
        typeName,
        isArray: false,
      })
    }
  }

  return patterns
}

/**
 * Replace inline enum patterns with SURef type references
 *
 * json-schema-to-typescript inlines enum values instead of preserving $ref.
 * This function post-processes the output to replace those inline values
 * with references to the already-generated SURef enum types.
 *
 * PATTERNS HANDLED:
 * - Standalone: `field: "val1" | "val2"` → `field: SURefEnumType`
 * - Arrays: `field: ("val1" | "val2")[]` → `field: SURefEnumType[]`
 * - Multi-line: `field:\n  | "val1"\n  | "val2"` → `field: SURefEnumType`
 * - Multi-line arrays: `field: (\n  | "val1"\n  | "val2"\n)[]` → `field: SURefEnumType[]`
 *
 * This works automatically for any enum defined in enums.schema.json
 * and referenced via $ref in other schemas.
 */
function replaceInlineEnums(
  output: string,
  enumPatterns: EnumPattern[]
): string {
  let result = output

  for (const { pattern, typeName } of enumPatterns) {
    // Replace standalone inline enums (field: "val1" | "val2" | ...)
    const standaloneRegex = new RegExp(
      `:\\s*${pattern.replace(/[|()]/g, '\\$&')}`,
      'g'
    )
    result = result.replace(standaloneRegex, `: ${typeName}`)

    // Replace array inline enums (field: ("val1" | "val2" | ...)[])
    const arrayRegex = new RegExp(
      `:\\s*\\(\\s*${pattern.replace(/[|()]/g, '\\$&')}\\s*\\)\\[\\]`,
      'g'
    )
    result = result.replace(arrayRegex, `: ${typeName}[]`)

    // Replace multi-line inline enums (field:\n    | "val1"\n    | "val2"\n    ...)
    // This handles the case where json-schema-to-typescript formats enums across multiple lines
    const values = pattern.split(' | ')
    const multilinePattern = values
      .map((val) => `\\s*\\|\\s*${val.replace(/"/g, '\\"')}`)
      .join('\\s*\\n')
    const multilineRegex = new RegExp(`:\\s*\\n${multilinePattern}\\s*;`, 'g')
    result = result.replace(multilineRegex, `: ${typeName};`)

    // Replace multi-line array inline enums (field: (\n    | "val1"\n    | "val2"\n    ...)[];)
    const multilineArrayPattern = values
      .map((val) => `\\s*\\|\\s*${val.replace(/"/g, '\\"')}`)
      .join('\\s*\\n')
    const multilineArrayRegex = new RegExp(
      `:\\s*\\(\\s*\\n${multilineArrayPattern}\\s*\\n\\s*\\)\\[\\];`,
      'g'
    )
    result = result.replace(multilineArrayRegex, `: ${typeName}[];`)
  }

  return result
}

// Derive objects.schema definitions from the schema file itself
function getObjectsMetaMap(): Record<string, string> {
  const objectsSchemaPath = path.join(SHARED_DIR, 'objects.schema.json')
  const objectsSchema = JSON.parse(fs.readFileSync(objectsSchemaPath, 'utf8'))

  const map: Record<string, string> = {}

  // Special cases for objects.schema definitions
  const specialCases: Record<string, string> = {
    npc: 'Npc', // Keep as Npc (not NPC) for objects definition
  }

  for (const defName of Object.keys(objectsSchema.definitions || {})) {
    // Use special cases if available, otherwise capitalize the definition name
    map[defName] = specialCases[defName] || capitalize(defName)
  }

  return map
}

// Derive list of simple primitive types to skip from common.schema
function getSkipCommonTypes(): Set<string> {
  const commonSchemaPath = path.join(SHARED_DIR, 'common.schema.json')
  const commonSchema = JSON.parse(
    fs.readFileSync(commonSchemaPath, 'utf8')
  ) as {
    definitions?: Record<string, unknown>
  }

  const skip = new Set<string>()

  for (const [defName, defSchema] of Object.entries(
    commonSchema.definitions || {}
  )) {
    const schema = defSchema as Record<string, unknown>

    // Skip if it's just a simple type wrapper (type: integer/string with no complex structure)
    if (schema.type && !schema.oneOf && !schema.anyOf && !schema.allOf) {
      // Also skip if it just has a $ref to another simple type
      if (!schema.properties && !schema.items) {
        skip.add(defName)
      }
    }
  }

  return skip
}

async function generateTypes() {
  console.log('🔧 Generating TypeScript types from JSON Schema...\n')

  const typeDefinitions: string[] = []

  // Header
  typeDefinitions.push('/**')
  typeDefinitions.push(' * Auto-generated TypeScript types from JSON Schema')
  typeDefinitions.push(' * DO NOT EDIT MANUALLY')
  typeDefinitions.push(' * Generated by tools/generateSchemaTypes.ts')
  typeDefinitions.push(' */\n')

  // Derive metadata from schemas
  const OBJECTS_META_MAP = getObjectsMetaMap()
  const skipCommonTypes = getSkipCommonTypes()
  const enumPatterns = getEnumPatterns()

  // Step 1: Generate types for shared schemas
  console.log('📚 Processing shared schemas...')

  // Process common.schema.json
  // Skip simple primitive wrappers - only generate types that add value (like enums)
  const commonSchemaPath = path.join(SHARED_DIR, 'common.schema.json')
  const commonSchema = JSON.parse(fs.readFileSync(commonSchemaPath, 'utf8'))

  typeDefinitions.push('// ============================================')
  typeDefinitions.push('// Common Type Definitions')
  typeDefinitions.push('// ============================================\n')

  for (const [defName, defSchema] of Object.entries(
    (commonSchema.definitions as Record<string, JSONSchema>) || {}
  )) {
    // Skip simple primitive wrappers
    if (skipCommonTypes.has(defName)) {
      continue
    }

    const typeName = `SURef${capitalize(defName)}`

    // Create a standalone schema with all definitions for proper $ref resolution
    const standaloneSchema = {
      ...defSchema,
      definitions: commonSchema.definitions,
    }

    const compiled = await compile(standaloneSchema, typeName, {
      bannerComment: '',
      declareExternallyReferenced: false,
      additionalProperties: false, // Treat all schemas as closed by default
    })
    typeDefinitions.push(compiled.trim())
  }

  // Process enums.schema.json
  const enumsSchemaPath = path.join(SHARED_DIR, 'enums.schema.json')
  const enumsSchema = JSON.parse(fs.readFileSync(enumsSchemaPath, 'utf8'))

  typeDefinitions.push('\n// ============================================')
  typeDefinitions.push('// Enum Type Definitions')
  typeDefinitions.push('// ============================================\n')

  for (const [defName, defSchema] of Object.entries(
    enumsSchema.definitions || {}
  )) {
    const typeName = `SURef${capitalize(defName)}`
    const compiled = await compile(
      defSchema as unknown as JSONSchema,
      typeName,
      {
        bannerComment: '',
        declareExternallyReferenced: false,
        additionalProperties: false, // Treat all schemas as closed by default
      }
    )
    typeDefinitions.push(compiled.trim())
  }

  // Process arrays.schema.json - these become SURefMeta* array types
  const arraysSchemaPath = path.join(SHARED_DIR, 'arrays.schema.json')
  const arraysSchema = JSON.parse(fs.readFileSync(arraysSchemaPath, 'utf8'))

  typeDefinitions.push('\n// ============================================')
  typeDefinitions.push('// Meta Array Type Definitions')
  typeDefinitions.push('// ============================================\n')

  // Helper types that need to be replaced in array definitions
  const arrayHelperTypes = [
    'Trait',
    'Action',
    'Choice',
    'System',
    'SystemModule',
    'Entry',
    'Damage',
    'Table',
    'Actions',
  ]

  for (const [defName, defSchema] of Object.entries(
    (arraysSchema.definitions as Record<string, JSONSchema>) || {}
  )) {
    const singularName = capitalize(defName)
    const typeName = `SURefMeta${singularName}`

    // Check if this array just references an object definition
    // If so, create a simple array type alias instead of re-expanding the type
    if (
      defSchema.type === 'array' &&
      defSchema.items &&
      !Array.isArray(defSchema.items) &&
      defSchema.items.$ref &&
      defSchema.items.$ref.includes('objects.schema.json#/definitions/')
    ) {
      const refName = defSchema.items.$ref.split('/').pop()
      const metaTypeName = `SURefMeta${capitalize(refName || '')}`

      typeDefinitions.push(`/**`)
      typeDefinitions.push(` * ${defSchema.description || typeName}`)
      typeDefinitions.push(` */`)
      typeDefinitions.push(`export type ${typeName} = ${metaTypeName}[]`)
      continue
    }

    // Create a standalone schema for compilation
    const standaloneSchema = {
      ...defSchema,
      definitions: arraysSchema.definitions,
    }

    const compiled = await compile(standaloneSchema, typeName, {
      bannerComment: '',
      declareExternallyReferenced: false,
      cwd: SHARED_DIR,
      additionalProperties: false,
    })

    // Replace helper type references with SURefMeta* versions
    let processedOutput = compiled.trim()
    for (const helperType of arrayHelperTypes) {
      const metaType = `SURefMeta${helperType}`

      // Replace type declarations
      processedOutput = processedOutput.replace(
        new RegExp(`export type ${helperType} =`, 'g'),
        `export type ${metaType} =`
      )
      processedOutput = processedOutput.replace(
        new RegExp(`export interface ${helperType}`, 'g'),
        `export interface ${metaType}`
      )

      // Replace array references
      processedOutput = processedOutput.replace(
        new RegExp(`\\b${helperType}\\[\\]`, 'g'),
        `${metaType}[]`
      )

      // Replace numbered variants (Action1, Action2, etc.)
      processedOutput = processedOutput.replace(
        new RegExp(`\\b${helperType}\\d+\\b`, 'g'),
        metaType
      )

      // Replace all other references (with word boundaries)
      processedOutput = processedOutput.replace(
        new RegExp(`\\b${helperType}\\b`, 'g'),
        metaType
      )
    }

    // Replace inline enums with SURef enum types
    processedOutput = replaceInlineEnums(processedOutput, enumPatterns)

    typeDefinitions.push(processedOutput)
  }

  // Process objects.schema.json - these become SURefMeta* types
  const objectsSchemaPath = path.join(SHARED_DIR, 'objects.schema.json')
  const objectsSchema = JSON.parse(fs.readFileSync(objectsSchemaPath, 'utf8'))

  typeDefinitions.push('\n// ============================================')
  typeDefinitions.push('// Meta Object Type Definitions')
  typeDefinitions.push('// ============================================\n')

  const helperTypes = [
    'Trait', // Singular form used in array references
    'Choice',
    'Entry',
    'System',
    'SystemModule',
    'Action',
    'Npc',
    'Table',
    'Damage',
    'Stats',
    'Actions', // Array type from arrays.schema
    'Traits', // Array type from arrays.schema
    'Choices', // Array type from arrays.schema
  ]

  for (const [defName, defSchema] of Object.entries(
    (objectsSchema.definitions as Record<string, JSONSchema>) || {}
  )) {
    const singularName = OBJECTS_META_MAP[defName] || capitalize(defName)
    const typeName = `SURefMeta${singularName}`

    // Create a standalone schema for compilation
    const standaloneSchema = {
      ...defSchema,
      definitions: objectsSchema.definitions,
    }

    const compiled = await compile(standaloneSchema, typeName, {
      bannerComment: '',
      declareExternallyReferenced: false,
      cwd: SHARED_DIR,
      additionalProperties: false, // Treat all schemas as closed by default
    })

    // Replace helper type references with SURefMeta* versions
    let processedOutput = compiled.trim()
    for (const helperType of helperTypes) {
      const metaType = `SURefMeta${helperType}`

      // Replace the base type name
      processedOutput = processedOutput.replace(
        new RegExp(`\\b${helperType}\\b`, 'g'),
        metaType
      )

      // Replace numbered variants (Action1, Action2, etc.) that json-schema-to-typescript generates
      processedOutput = processedOutput.replace(
        new RegExp(`\\b${helperType}\\d+\\b`, 'g'),
        metaType
      )
    }

    // Replace inline enums with SURef enum types
    processedOutput = replaceInlineEnums(processedOutput, enumPatterns)

    typeDefinitions.push(processedOutput)
  }

  // Step 2: Generate types for main schemas
  console.log('\n📋 Processing main schemas...')

  typeDefinitions.push('\n// ============================================')
  typeDefinitions.push('// Main Entity Type Definitions')
  typeDefinitions.push('// ============================================\n')

  const schemaFiles = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith('.schema.json') && f !== 'index.json')
    .sort()

  for (const schemaFile of schemaFiles) {
    const schemaPath = path.join(SCHEMAS_DIR, schemaFile)
    const schemaName = schemaFile.replace('.schema.json', '')
    const singularName = SCHEMA_NAME_MAP[schemaName]

    if (!singularName) {
      console.log(`⚠️  Skipping ${schemaFile} - no mapping found`)
      continue
    }

    console.log(`   Processing ${schemaFile} → SURef${singularName}`)

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))

    // The main type name - override the schema title
    const typeName = `SURef${singularName}`

    // Extract the items definition if this is an array schema
    // This creates singular types instead of array types
    let schemaToCompile
    if (schema.type === 'array' && schema.items) {
      schemaToCompile = {
        ...schema.items,
        title: typeName,
        definitions: schema.definitions, // Preserve any definitions
      }
    } else {
      schemaToCompile = {
        ...schema,
        title: typeName,
      }
    }

    // Check if this schema just references an object definition
    // If so, create a simple type alias instead of re-expanding the type
    if (
      schema.type === 'array' &&
      schema.items?.$ref &&
      schema.items.$ref.includes('objects.schema.json#/definitions/')
    ) {
      const refName = schema.items.$ref.split('/').pop()
      const metaTypeName = `SURefMeta${capitalize(refName || '')}`

      typeDefinitions.push(`// ${singularName}`)
      typeDefinitions.push(`export type ${typeName} = ${metaTypeName}`)
      typeDefinitions.push('')
      continue
    }

    try {
      const compiled = await compile(schemaToCompile, typeName, {
        bannerComment: '',
        declareExternallyReferenced: false, // Inline all types to avoid duplicates
        cwd: SCHEMAS_DIR,
        additionalProperties: false, // Treat all schemas as closed by default
        $refOptions: {
          resolve: {
            // Custom resolver for shared schemas
            file: {
              read: (file: { url: string }) => {
                const filePath = file.url.replace('file://', '')
                return fs.readFileSync(filePath, 'utf8')
              },
            },
          },
        },
      })

      // Remove duplicate type declarations by using SURefMeta* types for helper references
      let processedOutput = compiled.trim()

      // Derive helper types from OBJECTS_META_MAP (these are the shared object definitions)
      // Also include array type names from arrays.schema
      const helperTypes = [
        ...Object.values(OBJECTS_META_MAP),
        'Actions', // Array type from arrays.schema
        'Traits', // Array type from arrays.schema
        'Choices', // Array type from arrays.schema
        'Grants', // Array type from arrays.schema
        'Grantable', // Object type from objects.schema
        'SystemModule', // Object type from objects.schema (used by systems and modules)
        'SchemaEntities', // Array type from arrays.schema
        'SchemaNames', // Array type from arrays.schema
        'Systems', // Array type from arrays.schema
        'Modules', // Array type from arrays.schema
        'CustomSystemOptions', // Array type from arrays.schema
        'ActionOptions', // Array type from arrays.schema
      ]

      // Replace all occurrences of helper type names with SURefMeta* versions
      for (const helperType of helperTypes) {
        const metaType = `SURefMeta${helperType}`

        // Replace type/interface declarations (these shouldn't exist in main schemas, but just in case)
        processedOutput = processedOutput.replace(
          new RegExp(`export type ${helperType} =`, 'g'),
          `export type ${metaType} =`
        )
        processedOutput = processedOutput.replace(
          new RegExp(`export interface ${helperType}`, 'g'),
          `export interface ${metaType}`
        )

        // Replace all references (with word boundaries to avoid partial matches)
        processedOutput = processedOutput.replace(
          new RegExp(`\\b${helperType}\\b`, 'g'),
          metaType
        )
      }

      // Replace inline enum definitions with references to SURef enum types
      // This handles cases where json-schema-to-typescript inlines enum values
      // instead of using $ref to the enum definitions
      processedOutput = replaceInlineEnums(processedOutput, enumPatterns)

      // Replace inline table definitions with SURefMetaTable
      // The table field is a complex union type that should reference SURefMetaTable
      // Handle both optional (table?:) and required (table:) fields
      processedOutput = processedOutput.replace(
        /table\?:\s*\n\s*\|\s*\{\s*\n[^}]*"1":\s*string;[^}]*type:\s*"standard";[^}]*\}\s*\n\s*\|\s*\{[^}]*type:\s*"alternate";[^}]*\}\s*\n\s*\|\s*\{[^}]*"20":\s*string;[^}]*\};/gs,
        'table?: SURefMetaTable;'
      )
      processedOutput = processedOutput.replace(
        /table:\s*\n\s*\|\s*\{\s*\n[^}]*"1":\s*string;[^}]*type:\s*"standard";[^}]*\}\s*\n\s*\|\s*\{[^}]*type:\s*"alternate";[^}]*\}\s*\n\s*\|\s*\{[^}]*"20":\s*string;[^}]*\};/gs,
        'table: SURefMetaTable;'
      )

      // Remove duplicate type declarations for SURefMeta* types that were already defined in shared schemas
      // json-schema-to-typescript sometimes inlines these even though we've already defined them
      // We need to remove the entire type declaration including nested braces
      for (const helperType of helperTypes) {
        const metaType = `SURefMeta${helperType}`

        // Find and remove duplicate declarations by matching balanced braces
        // This is a simple approach: find the start of the declaration, then count braces to find the end
        let searchPos = 0
        while (true) {
          const exportMatch = processedOutput.indexOf(
            `export type ${metaType} =`,
            searchPos
          )
          if (exportMatch === -1) break

          // Find the start of this declaration (including any JSDoc before it)
          let declStart = exportMatch
          // Look backwards for JSDoc comment
          const beforeDecl = processedOutput.substring(
            Math.max(0, exportMatch - 500),
            exportMatch
          )
          const jsdocMatch = beforeDecl.lastIndexOf('/**')
          if (jsdocMatch !== -1) {
            declStart = exportMatch - (beforeDecl.length - jsdocMatch)
          }

          // Find the end by counting braces
          let braceCount = 0
          let inBraces = false
          let declEnd = exportMatch

          for (let i = exportMatch; i < processedOutput.length; i++) {
            const char = processedOutput[i]
            if (char === '{') {
              braceCount++
              inBraces = true
            } else if (char === '}') {
              braceCount--
              if (inBraces && braceCount === 0) {
                // Found the closing brace, now find the semicolon
                const afterBrace = processedOutput.substring(i, i + 10)
                const semiMatch = afterBrace.indexOf(';')
                if (semiMatch !== -1) {
                  declEnd = i + semiMatch + 1
                  break
                }
              }
            }
          }

          // Remove this declaration
          processedOutput =
            processedOutput.substring(0, declStart) +
            processedOutput.substring(declEnd)

          // Continue searching from the same position (since we removed text)
          searchPos = declStart
        }
      }

      typeDefinitions.push(`// ${singularName}`)
      typeDefinitions.push(processedOutput)
      typeDefinitions.push('')
    } catch (error) {
      console.error(`❌ Error processing ${schemaFile}:`, error)
    }
  }

  // Add helper union types at the end
  // Note: SURefSchemaName is now auto-generated from enums.schema.json#/definitions/schemaName

  // Generate SURefEntity from SCHEMA_NAME_MAP values
  const entityTypes = Object.values(SCHEMA_NAME_MAP)
    .sort()
    .map((name) => `  | SURef${name}`)
    .join('\n')

  const helperUnionTypes = `
// ============================================
// Helper Union Types
// ============================================

/**
 * Union of all file-level schema entity types
 */
export type SURefEntity =
${entityTypes}

/**
 * Union of all valid meta schema names (includes actions)
 * Note: SURefSchemaName is auto-generated from enums.schema.json
 */
export type SURefMetaSchemaName = SURefSchemaName | 'actions'

/**
 * Union of all meta entity types (includes actions)
 */
export type SURefMetaEntity = SURefEntity | SURefMetaAction
`

  typeDefinitions.push(helperUnionTypes)

  // Write output file
  const output = typeDefinitions.join('\n')
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8')

  console.log(`\n✅ Types generated successfully!`)
  console.log(`📄 Output: ${OUTPUT_FILE}`)
}

// Run the generator
generateTypes().catch((error) => {
  console.error('❌ Type generation failed:', error)
  process.exit(1)
})
