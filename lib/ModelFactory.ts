/**
 * Model Factory - Auto-generates models from schema catalog
 */
import { BaseModel } from './BaseModel.js'
import schemaIndex from '../schemas/index.json' with { type: 'json' }

// Import all data files
import abilitiesData from '../data/abilities.json' with { type: 'json' }
import abilityTreeRequirementsData from '../data/ability-tree-requirements.json' with { type: 'json' }
import bioTitansData from '../data/bio-titans.json' with { type: 'json' }
import chassisData from '../data/chassis.json' with { type: 'json' }
import advancedClassesData from '../data/classes.advanced.json' with { type: 'json' }
import coreClassesData from '../data/classes.core.json' with { type: 'json' }
import hybridClassesData from '../data/classes.hybrid.json' with { type: 'json' }
import crawlersData from '../data/crawlers.json' with { type: 'json' }
import crawlerBaysData from '../data/crawler-bays.json' with { type: 'json' }
import crawlerTechLevelsData from '../data/crawler-tech-levels.json' with { type: 'json' }
import creaturesData from '../data/creatures.json' with { type: 'json' }
import dronesData from '../data/drones.json' with { type: 'json' }
import equipmentData from '../data/equipment.json' with { type: 'json' }
import keywordsData from '../data/keywords.json' with { type: 'json' }
import meldData from '../data/meld.json' with { type: 'json' }
import modulesData from '../data/modules.json' with { type: 'json' }
import npcsData from '../data/npcs.json' with { type: 'json' }
import squadsData from '../data/squads.json' with { type: 'json' }
import systemsData from '../data/systems.json' with { type: 'json' }
import rollTablesData from '../data/roll-tables.json' with { type: 'json' }
import traitsData from '../data/traits.json' with { type: 'json' }
import vehiclesData from '../data/vehicles.json' with { type: 'json' }

// Import all schemas
import abilitiesSchema from '../schemas/abilities.schema.json' with { type: 'json' }
import abilityTreeRequirementsSchema from '../schemas/ability-tree-requirements.schema.json' with { type: 'json' }
import bioTitansSchema from '../schemas/bio-titans.schema.json' with { type: 'json' }
import chassisSchema from '../schemas/chassis.schema.json' with { type: 'json' }
import advancedClassesSchema from '../schemas/classes.advanced.schema.json' with { type: 'json' }
import coreClassesSchema from '../schemas/classes.core.schema.json' with { type: 'json' }
import hybridClassesSchema from '../schemas/classes.hybrid.schema.json' with { type: 'json' }
import crawlersSchema from '../schemas/crawlers.schema.json' with { type: 'json' }
import crawlerBaysSchema from '../schemas/crawler-bays.schema.json' with { type: 'json' }
import crawlerTechLevelsSchema from '../schemas/crawler-tech-levels.schema.json' with { type: 'json' }
import creaturesSchema from '../schemas/creatures.schema.json' with { type: 'json' }
import dronesSchema from '../schemas/drones.schema.json' with { type: 'json' }
import equipmentSchema from '../schemas/equipment.schema.json' with { type: 'json' }
import keywordsSchema from '../schemas/keywords.schema.json' with { type: 'json' }
import meldSchema from '../schemas/meld.schema.json' with { type: 'json' }
import modulesSchema from '../schemas/modules.schema.json' with { type: 'json' }
import npcsSchema from '../schemas/npcs.schema.json' with { type: 'json' }
import squadsSchema from '../schemas/squads.schema.json' with { type: 'json' }
import systemsSchema from '../schemas/systems.schema.json' with { type: 'json' }
import rollTablesSchema from '../schemas/roll-tables.schema.json' with { type: 'json' }
import traitsSchema from '../schemas/traits.schema.json' with { type: 'json' }
import vehiclesSchema from '../schemas/vehicles.schema.json' with { type: 'json' }

// Map schema IDs to data and schema imports
const dataMap: Record<string, unknown[]> = {
  abilities: abilitiesData,
  'ability-tree-requirements': abilityTreeRequirementsData,
  'bio-titans': bioTitansData,
  chassis: chassisData,
  'classes.advanced': advancedClassesData,
  'classes.core': coreClassesData,
  'classes.hybrid': hybridClassesData,
  crawlers: crawlersData,
  'crawler-bays': crawlerBaysData,
  'crawler-tech-levels': crawlerTechLevelsData,
  creatures: creaturesData,
  drones: dronesData,
  equipment: equipmentData,
  keywords: keywordsData,
  meld: meldData,
  modules: modulesData,
  npcs: npcsData,
  squads: squadsData,
  systems: systemsData,
  'roll-tables': rollTablesData,
  traits: traitsData,
  vehicles: vehiclesData,
}

const schemaMap: Record<string, Record<string, unknown>> = {
  abilities: abilitiesSchema as Record<string, unknown>,
  'ability-tree-requirements': abilityTreeRequirementsSchema as Record<
    string,
    unknown
  >,
  'bio-titans': bioTitansSchema as Record<string, unknown>,
  chassis: chassisSchema as Record<string, unknown>,
  'classes.advanced': advancedClassesSchema as Record<string, unknown>,
  'classes.core': coreClassesSchema as Record<string, unknown>,
  'classes.hybrid': hybridClassesSchema as Record<string, unknown>,
  crawlers: crawlersSchema as Record<string, unknown>,
  'crawler-bays': crawlerBaysSchema as Record<string, unknown>,
  'crawler-tech-levels': crawlerTechLevelsSchema as Record<string, unknown>,
  creatures: creaturesSchema as Record<string, unknown>,
  drones: dronesSchema as Record<string, unknown>,
  equipment: equipmentSchema as Record<string, unknown>,
  keywords: keywordsSchema as Record<string, unknown>,
  meld: meldSchema as Record<string, unknown>,
  modules: modulesSchema as Record<string, unknown>,
  npcs: npcsSchema as Record<string, unknown>,
  squads: squadsSchema as Record<string, unknown>,
  systems: systemsSchema as Record<string, unknown>,
  'roll-tables': rollTablesSchema as Record<string, unknown>,
  traits: traitsSchema as Record<string, unknown>,
  vehicles: vehiclesSchema as Record<string, unknown>,
}

/**
 * Convert schema ID to PascalCase property name
 * Examples:
 *   abilities -> Abilities
 *   ability-tree-requirements -> AbilityTreeRequirements
 *   classes.core -> CoreClasses
 *   classes.hybrid -> HybridClasses
 */
function toPascalCase(id: string): string {
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
export function createModel<T>(schemaId: string): BaseModel<T> {
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
export function generateModels(): Record<string, BaseModel<unknown>> {
  const models: Record<string, BaseModel<unknown>> = {}

  for (const schemaEntry of schemaIndex.schemas) {
    const propertyName = toPascalCase(schemaEntry.id)
    models[propertyName] = createModel(schemaEntry.id)
  }

  return models
}
