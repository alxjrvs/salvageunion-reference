/**
 * Model Factory - Auto-generates models from schema catalog
 * Uses dynamic imports to automatically load data and schemas
 */
import { BaseModel } from './BaseModel.js'
import schemaIndex from '../schemas/index.json' with { type: 'json' }

/**
 * Dynamically import data file based on schema entry
 */
async function importData(dataFile: string): Promise<unknown[]> {
  const module = await import(`../${dataFile}`, { with: { type: 'json' } })
  return module.default as unknown[]
}

/**
 * Dynamically import schema file based on schema entry
 */
async function importSchema(
  schemaFile: string
): Promise<Record<string, unknown>> {
  const module = await import(`../${schemaFile}`, { with: { type: 'json' } })
  return module.default as Record<string, unknown>
}

/**
 * Build data and schema maps dynamically from schema catalog
 */
async function buildMaps(): Promise<{
  dataMap: Record<string, unknown[]>
  schemaMap: Record<string, Record<string, unknown>>
}> {
  const dataMap: Record<string, unknown[]> = {}
  const schemaMap: Record<string, Record<string, unknown>> = {}

  await Promise.all(
    schemaIndex.schemas.map(async (entry) => {
      const [data, schema] = await Promise.all([
        importData(entry.dataFile),
        importSchema(entry.schemaFile),
      ])
      dataMap[entry.id] = data
      schemaMap[entry.id] = schema
    })
  )

  return { dataMap, schemaMap }
}

// Build maps at module load time
const mapsPromise = buildMaps()

/**
 * Get the data and schema maps
 * Exposed for client use
 */
export async function getDataMaps(): Promise<{
  dataMap: Record<string, unknown[]>
  schemaMap: Record<string, Record<string, unknown>>
}> {
  return mapsPromise
}

/**
 * Convert schema ID to PascalCase property name
 * Examples:
 *   abilities -> Abilities
 *   ability-tree-requirements -> AbilityTreeRequirements
 *   classes.core -> CoreClasses
 *   classes.hybrid -> HybridClasses
 *
 * Exposed for client use
 */
export function toPascalCase(id: string): string {
  // Handle special cases for classes
  if (id === 'classes.core') return 'CoreClasses'
  if (id === 'classes.hybrid') return 'HybridClasses'
  if (id === 'classes.advanced') return 'AdvancedClasses'

  // Handle hyphenated and dotted names
  return id
    .split(/[-.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Create a model instance for a given schema entry
 */
async function createModel<T>(schemaId: string): Promise<BaseModel<T>> {
  const { dataMap, schemaMap } = await mapsPromise
  const data = dataMap[schemaId]
  const schema = schemaMap[schemaId]

  if (!data || !schema) {
    throw new Error(`No data or schema found for schema ID: ${schemaId}`)
  }

  return new BaseModel<T>(data as T[], schema)
}

/**
 * Auto-generate all models from the schema catalog
 */
export async function generateModels(): Promise<
  Record<string, BaseModel<unknown>>
> {
  const models: Record<string, BaseModel<unknown>> = {}

  await Promise.all(
    schemaIndex.schemas.map(async (schemaEntry) => {
      const propertyName = toPascalCase(schemaEntry.id)
      models[propertyName] = await createModel(schemaEntry.id)
    })
  )

  return models
}

/**
 * Get schema catalog
 * Exposed for client use
 */
export function getSchemaCatalog() {
  return schemaIndex
}
