#!/usr/bin/env tsx

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Validator } from 'jsonschema'
import schemaIndex from '../schemas/index.json' with { type: 'json' }

// Get the project root directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

interface ValidationConfig {
  name: string
  dataFile: string
  schemaFile: string
}

// Build validation configs from schema catalog
const validationConfigs: ValidationConfig[] = schemaIndex.schemas.map(
  (schema) => ({
    name: schema.title,
    dataFile: schema.dataFile,
    schemaFile: schema.schemaFile,
  })
)

function loadJson(filePath: string): unknown {
  const fullPath = join(projectRoot, filePath)
  const content = readFileSync(fullPath, 'utf-8')
  return JSON.parse(content)
}

interface JSONSchemaObject {
  $id?: string
  [key: string]: unknown
}

const globalValidator = new Validator()

function loadSharedSchemas() {
  const sharedSchemas = [
    {
      path: 'schemas/shared/common.schema.json',
      relativeId: 'shared/common.schema.json',
    },
    {
      path: 'schemas/shared/enums.schema.json',
      relativeId: 'shared/enums.schema.json',
    },
    {
      path: 'schemas/shared/objects.schema.json',
      relativeId: 'shared/objects.schema.json',
    },
  ]

  for (const sharedInfo of sharedSchemas) {
    try {
      const sharedSchema = loadJson(sharedInfo.path) as JSONSchemaObject

      // Register with the relative ID for $ref resolution
      globalValidator.addSchema(sharedSchema, sharedInfo.relativeId)

      // Also register with the $id URL if present (best practice)
      if (sharedSchema.$id) {
        globalValidator.addSchema(sharedSchema, sharedSchema.$id)
      }

      // Log successful registration
      console.log(
        `   ✓ Loaded ${sharedInfo.relativeId}${
          sharedSchema.$id ? ` ($id: ${sharedSchema.$id})` : ''
        }`
      )
    } catch (error) {
      console.error(
        `   ✗ Warning: Could not load shared schema ${sharedInfo.path}`
      )
      if (error instanceof Error) {
        console.error(`     ${error.message}`)
      }
    }
  }
}

function loadSchema(schemaPath: string): JSONSchemaObject {
  return loadJson(schemaPath) as JSONSchemaObject
}

function validateData(config: ValidationConfig): boolean {
  try {
    console.log(`\n📋 Validating ${config.name}...`)

    const data = loadJson(config.dataFile)
    const schema = loadSchema(config.schemaFile)

    const result = globalValidator.validate(data, schema)

    if (result.valid) {
      console.log(`✅ ${config.name}: VALID`)
      return true
    } else {
      console.log(`❌ ${config.name}: INVALID`)

      // Group errors by item for better readability
      const errorsByItem = new Map<string, string[]>()

      result.errors.forEach((error) => {
        const itemPath = error.property || 'root'
        if (!errorsByItem.has(itemPath)) {
          errorsByItem.set(itemPath, [])
        }
        errorsByItem.get(itemPath)!.push(error.stack)
      })

      // Show first 20 errors to avoid overwhelming output
      const maxErrors = 20
      let errorCount = 0

      console.log(`   Errors (showing first ${maxErrors}):`)
      for (const [, errors] of errorsByItem) {
        for (const error of errors) {
          if (errorCount >= maxErrors) {
            const remaining = result.errors.length - maxErrors
            console.log(`   ... and ${remaining} more errors`)
            return false
          }
          console.log(`   ${errorCount + 1}. ${error}`)
          errorCount++
        }
      }

      return false
    }
  } catch (error) {
    console.log(`❌ ${config.name}: ERROR`)
    console.log(`   ${error instanceof Error ? error.message : String(error)}`)
    return false
  }
}

function main() {
  console.log('🔍 Salvage Union Data Validation')
  console.log('=================================')
  console.log('\n📚 Loading Shared Schemas...')

  // Load shared schemas once before validating
  loadSharedSchemas()

  console.log('\n🔍 Validating Data Files...')
  console.log('=================================')

  let allValid = true
  let validCount = 0
  let invalidCount = 0

  for (const config of validationConfigs) {
    const isValid = validateData(config)
    if (isValid) {
      validCount++
    } else {
      invalidCount++
      allValid = false
    }
  }

  console.log('\n=================================')
  console.log(`📊 Summary: ${validCount} valid, ${invalidCount} invalid`)

  if (allValid) {
    console.log('✅ All data files are valid!')
    process.exit(0)
  } else {
    console.log('❌ Some data files have validation errors.')
    process.exit(1)
  }
}

main()
