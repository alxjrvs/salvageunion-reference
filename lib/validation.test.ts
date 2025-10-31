import { describe, expect, it, beforeAll } from 'vitest'
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
  id: string
  title: string
  dataFile: string
  schemaFile: string
}

// Build validation configs from schema catalog
const validationConfigs: ValidationConfig[] = schemaIndex.schemas.map(
  (schema) => ({
    id: schema.id,
    title: schema.title,
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

// Load shared schemas once before all tests
beforeAll(() => {
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
    const sharedSchema = loadJson(sharedInfo.path) as JSONSchemaObject

    // Register with the relative ID for $ref resolution
    globalValidator.addSchema(sharedSchema, sharedInfo.relativeId)

    // Also register with the $id URL if present
    if (sharedSchema.$id) {
      globalValidator.addSchema(sharedSchema, sharedSchema.$id)
    }
  }
})

function loadSchema(schemaPath: string): JSONSchemaObject {
  return loadJson(schemaPath) as JSONSchemaObject
}

describe('Schema Validation', () => {
  // Create a test for each data file
  for (const config of validationConfigs) {
    it(`should validate ${config.title}`, () => {
      const data = loadJson(config.dataFile)
      const schema = loadSchema(config.schemaFile)

      const result = globalValidator.validate(data, schema, {
        nestedErrors: true,
      })

      if (!result.valid) {
        // Format errors for better test output
        const errorMessages = result.errors.map((error, index) => {
          return `  ${index + 1}. ${error.property}: ${error.message}`
        })

        // Show first 10 errors in the test output
        const displayErrors = errorMessages.slice(0, 10)
        const remainingCount = errorMessages.length - 10

        let errorOutput = `${config.title} validation failed with ${result.errors.length} error(s):\n`
        errorOutput += displayErrors.join('\n')

        if (remainingCount > 0) {
          errorOutput += `\n  ... and ${remainingCount} more error(s)`
        }

        throw new Error(errorOutput)
      }

      expect(result.valid).toBe(true)
    })
  }
})

describe('Schema Files', () => {
  it('should have all schemas registered in index.json', () => {
    expect(schemaIndex.schemas.length).toBeGreaterThan(0)
  })

  it('should have valid schema file paths', () => {
    for (const config of validationConfigs) {
      expect(() => loadSchema(config.schemaFile)).not.toThrow()
    }
  })

  it('should have valid data file paths', () => {
    for (const config of validationConfigs) {
      expect(() => loadJson(config.dataFile)).not.toThrow()
    }
  })

  it('should have all schemas with required metadata', () => {
    for (const schema of schemaIndex.schemas) {
      expect(schema.id).toBeDefined()
      expect(schema.title).toBeDefined()
      expect(schema.dataFile).toBeDefined()
      expect(schema.schemaFile).toBeDefined()
    }
  })
})

describe('Schema Catalog Enhancement', () => {
  it('should have display names for all schemas', () => {
    const catalog = import('../lib/ModelFactory.js').then((m) =>
      m.getSchemaCatalog()
    )

    catalog.then((cat) => {
      for (const schema of cat.schemas) {
        expect(schema.displayName).toBeDefined()
        expect(schema.displayNamePlural).toBeDefined()
        expect(typeof schema.displayName).toBe('string')
        expect(typeof schema.displayNamePlural).toBe('string')
        expect(schema.displayName.length).toBeGreaterThan(0)
        expect(schema.displayNamePlural.length).toBeGreaterThan(0)
      }
    })
  })
})
