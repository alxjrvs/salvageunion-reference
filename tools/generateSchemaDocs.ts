#!/usr/bin/env tsx
/**
 * Generates markdown documentation from JSON schemas
 * Creates comprehensive docs with field descriptions, required/optional fields, and examples
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const schemasDir = join(__dirname, '..', 'schemas')
const dataDir = join(__dirname, '..', 'data')
const docsDir = join(__dirname, '..', 'docs', 'schemas')

// Create docs directory if it doesn't exist
mkdirSync(docsDir, { recursive: true })

interface SchemaInfo {
  id: string
  title: string
  description: string
  schemaFile: string
  dataFile: string
}

// Load schema index
const schemaIndex = JSON.parse(
  readFileSync(join(schemasDir, 'index.json'), 'utf-8')
)

function generateFieldTable(properties: any, required: string[] = []): string {
  if (!properties) return ''

  let table = '| Field | Type | Required | Description |\n'
  table += '|-------|------|----------|-------------|\n'

  for (const [fieldName, fieldDef] of Object.entries(properties)) {
    const def = fieldDef as any

    // Skip fields that are just `true` (inherited from allOf)
    if (def === true) continue

    const isRequired = required.includes(fieldName) ? '✅' : '❌'
    const type = getFieldType(def)
    const description = def.description || ''

    table += `| \`${fieldName}\` | ${type} | ${isRequired} | ${description} |\n`
  }

  return table
}

function getFieldType(def: any): string {
  if (def.$ref) {
    const refParts = def.$ref.split('/')
    return `\`${refParts[refParts.length - 1]}\``
  }

  if (def.type === 'array') {
    if (def.items?.$ref) {
      const refParts = def.items.$ref.split('/')
      return `Array<\`${refParts[refParts.length - 1]}\`>`
    }
    if (def.items?.type) {
      return `Array<${def.items.type}>`
    }
    return 'Array'
  }

  if (def.type) {
    return def.type
  }

  if (def.oneOf) {
    return def.oneOf.map((o: any) => getFieldType(o)).join(' | ')
  }

  if (def.const) {
    return `"${def.const}"`
  }

  return 'unknown'
}

function generateExampleJson(schema: any, data: any[]): string {
  if (!data || data.length === 0)
    return '```json\n// No example data available\n```'

  // Get first item as example
  const example = data[0]
  return '```json\n' + JSON.stringify(example, null, 2) + '\n```'
}

function generateSchemaDoc(schemaInfo: SchemaInfo): string {
  // Load schema
  const schema = JSON.parse(
    readFileSync(
      join(schemasDir, schemaInfo.schemaFile.replace('schemas/', '')),
      'utf-8'
    )
  )

  // Load data for examples
  let data: any[] = []
  try {
    data = JSON.parse(
      readFileSync(
        join(dataDir, schemaInfo.dataFile.replace('data/', '')),
        'utf-8'
      )
    )
  } catch (error) {
    console.warn(`Could not load data for ${schemaInfo.id}`)
  }

  let doc = `# ${schemaInfo.title}\n\n`
  doc += `${schemaInfo.description}\n\n`

  // Add metadata
  doc += `## Metadata\n\n`
  doc += `- **Schema ID**: \`${schemaInfo.id}\`\n`
  doc += `- **Schema File**: \`${schemaInfo.schemaFile}\`\n`
  doc += `- **Data File**: \`${schemaInfo.dataFile}\`\n`
  doc += `- **Total Items**: ${data.length}\n\n`

  // Add field documentation
  if (schema.items?.properties) {
    doc += `## Fields\n\n`
    doc += generateFieldTable(
      schema.items.properties,
      schema.items.required || []
    )
    doc += '\n'
  }

  // Add example
  doc += `## Example\n\n`
  doc += generateExampleJson(schema, data)
  doc += '\n'

  // Add common patterns if available
  if (schema.items?.allOf) {
    doc += `## Schema Composition\n\n`
    doc += `This schema extends the following definitions:\n\n`
    for (const ref of schema.items.allOf) {
      if (ref.$ref) {
        doc += `- \`${ref.$ref}\`\n`
      }
    }
    doc += '\n'
  }

  return doc
}

// Generate docs for all schemas
console.log('Generating schema documentation...\n')

for (const schemaInfo of schemaIndex.schemas) {
  try {
    const doc = generateSchemaDoc(schemaInfo)
    const filename = `${schemaInfo.id}.md`
    writeFileSync(join(docsDir, filename), doc)
    console.log(`✅ Generated ${filename}`)
  } catch (error) {
    console.error(`❌ Error generating docs for ${schemaInfo.id}:`, error)
  }
}

console.log(`\n✅ Schema documentation generated in ${docsDir}`)
