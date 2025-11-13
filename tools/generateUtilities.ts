#!/usr/bin/env tsx
/**
 * Auto-generates utility functions from schema definitions
 * Creates type guards and property extractors based on schema structure
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getSingularTypeName } from './generatorUtils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const schemasDir = join(__dirname, '..', 'schemas')
const outputFile = join(__dirname, '..', 'lib', 'utilities-generated.ts')

// Load schema index
const schemaIndex = JSON.parse(
  readFileSync(join(schemasDir, 'index.json'), 'utf-8')
)

interface PropertyInfo {
  name: string
  type: string
  required: boolean
}

function extractProperties(schemaFile: string): PropertyInfo[] {
  const schema = JSON.parse(
    readFileSync(join(schemasDir, schemaFile.replace('schemas/', '')), 'utf-8')
  )
  const properties: PropertyInfo[] = []
  const propertyMap = new Map<string, PropertyInfo>()

  if (!schema.items?.properties) return properties

  const required = schema.items.required || []

  // First, extract properties from allOf references
  if (schema.items.allOf) {
    for (const ref of schema.items.allOf) {
      if (ref.$ref) {
        const refPath = ref.$ref
          .replace('#/$defs/', '')
          .replace('#/definitions/', '')
        const refParts = refPath.split('/')
        const defName = refParts[refParts.length - 1]

        // Try to load the referenced schema
        let refSchema
        if (refPath.startsWith('shared/')) {
          const sharedFile = refPath.split('/')[1] + '.schema.json'
          try {
            refSchema = JSON.parse(
              readFileSync(join(schemasDir, 'shared', sharedFile), 'utf-8')
            )
          } catch {
            continue
          }
        }

        // Extract properties from the referenced definition
        if (refSchema?.$defs?.[defName]?.properties) {
          const refProps = refSchema.$defs[defName].properties
          const refRequired = refSchema.$defs[defName].required || []

          for (const [propName, propDef] of Object.entries(refProps)) {
            const def = propDef as Record<string, unknown>
            if (def === true) continue

            let type = 'unknown'
            if (def.type) {
              type = String(def.type)
            } else if (def.$ref) {
              const parts = String(def.$ref).split('/')
              type = parts[parts.length - 1]
            }

            propertyMap.set(propName, {
              name: propName,
              type,
              required: refRequired.includes(propName),
            })
          }
        }
      }
    }
  }

  // Then add/override with direct properties
  for (const [propName, propDef] of Object.entries(schema.items.properties)) {
    const def = propDef as Record<string, unknown>

    // Skip inherited properties (marked as true) unless we don't have them yet
    if (def === true) continue

    let type = 'unknown'
    if (def.type) {
      type = String(def.type)
    } else if (def.$ref) {
      const refParts = def.$ref.split('/')
      type = refParts[refParts.length - 1]
    }

    propertyMap.set(propName, {
      name: propName,
      type,
      required: required.includes(propName),
    })
  }

  return Array.from(propertyMap.values())
}

function generateTypeGuard(
  schemaId: string,
  typeName: string,
  properties: PropertyInfo[]
): string {
  const requiredProps = properties.filter((p) => p.required)

  if (requiredProps.length === 0) return ''

  let code = `/**\n`
  code += ` * Type guard to check if an entity is a ${typeName}\n`
  code += ` * @param entity - The entity to check\n`
  code += ` * @returns True if the entity is a ${typeName}\n`
  code += ` */\n`
  code += `export function is${typeName}(entity: SURefMetaEntity): entity is SURef${typeName} {\n`
  code += `  return (\n`

  const checks = requiredProps.map((prop) => {
    return `    '${prop.name}' in entity`
  })

  code += checks.join(' &&\n')
  code += `\n  )\n`
  code += `}\n\n`

  return code
}

function generatePropertyExtractor(propName: string, propType: string): string {
  const functionName = `get${propName.charAt(0).toUpperCase()}${propName.slice(1)}`

  let code = `/**\n`
  code += ` * Extract ${propName} from an entity\n`
  code += ` * @param entity - The entity to extract from\n`
  code += ` * @returns The ${propName} or undefined\n`
  code += ` */\n`
  code += `export function ${functionName}(entity: SURefMetaEntity): `

  // Determine return type
  if (propType === 'string') {
    code += `string | undefined {\n`
    code += `  return '${propName}' in entity && typeof entity.${propName} === 'string'\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (propType === 'number' || propType === 'integer') {
    code += `number | undefined {\n`
    code += `  return '${propName}' in entity && typeof entity.${propName} === 'number'\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (propType === 'boolean') {
    code += `boolean | undefined {\n`
    code += `  return '${propName}' in entity && typeof entity.${propName} === 'boolean'\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (propType === 'array') {
    code += `unknown[] | undefined {\n`
    code += `  return '${propName}' in entity && Array.isArray(entity.${propName})\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else {
    code += `unknown {\n`
    code += `  return '${propName}' in entity ? entity.${propName} : undefined\n`
  }

  code += `}\n\n`

  return code
}

// Generate utilities
console.log('Generating utility functions from schemas...\n')

let output = `/**\n`
output += ` * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY\n`
output += ` * Generated by tools/generateUtilities.ts\n`
output += ` * \n`
output += ` * Type guards and property extractors generated from JSON schemas\n`
output += ` */\n\n`
output += `/* eslint-disable @typescript-eslint/no-unused-vars */\n\n`
output += `import type { SURefMetaEntity } from './types/index.js'\n`
output += `import type {\n`

// Add imports for all schema types
const typeImports = schemaIndex.schemas
  .map(
    (s: Record<string, unknown>) =>
      `  SURef${getSingularTypeName(String(s.id), __dirname)}`
  )
  .join(',\n')

output += typeImports
output += `\n} from './types/index.js'\n\n`
output += `// ============================================================================\n`
output += `// TYPE GUARDS\n`
output += `// ============================================================================\n\n`

// Generate type guards for each schema
for (const schemaInfo of schemaIndex.schemas) {
  const properties = extractProperties(schemaInfo.schemaFile)
  const typeName = getSingularTypeName(schemaInfo.id, __dirname)
  output += generateTypeGuard(schemaInfo.id, typeName, properties)
}

output += `// ============================================================================\n`
output += `// PROPERTY EXTRACTORS\n`
output += `// ============================================================================\n\n`

// Collect all unique properties across all schemas
const allProperties = new Map<string, string>()
for (const schemaInfo of schemaIndex.schemas) {
  const properties = extractProperties(schemaInfo.schemaFile)
  for (const prop of properties) {
    if (!allProperties.has(prop.name)) {
      allProperties.set(prop.name, prop.type)
    }
  }
}

// Generate property extractors for all properties
// Prioritize common properties first, then add the rest
const priorityProperties = [
  'techLevel',
  'salvageValue',
  'slotsRequired',
  'structurePoints',
  'energyPoints',
  'heatCapacity',
  'systemSlots',
  'moduleSlots',
  'cargoCapacity',
  'hitPoints',
  'armour',
  'speed',
  'maxAbilities',
  'level',
  'tree',
  'description',
  'actions',
  'grants',
  'traits',
  'systems',
]

const generatedExtractors = new Set<string>()

// Generate extractors for priority properties first
for (const propName of priorityProperties) {
  if (allProperties.has(propName)) {
    output += generatePropertyExtractor(propName, allProperties.get(propName)!)
    generatedExtractors.add(propName)
  }
}

// Generate extractors for remaining properties
for (const [propName, propType] of allProperties.entries()) {
  if (!generatedExtractors.has(propName)) {
    output += generatePropertyExtractor(propName, propType)
    generatedExtractors.add(propName)
  }
}

writeFileSync(outputFile, output)
console.log(`✅ Generated ${outputFile}`)
console.log(`   - ${schemaIndex.schemas.length} type guards`)
console.log(`   - ${generatedExtractors.size} property extractors`)
