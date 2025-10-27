/**
 * Salvage Union Data ORM
 *
 * Type-safe query interface for Salvage Union game data
 * Models are auto-generated from the schema catalog
 */

import { BaseModel } from './BaseModel.js'
import { generateModels } from './ModelFactory.js'
import type {
  SURefAbility,
  SURefAbilityTreeRequirement,
  SURefBioTitan,
  SURefChassis,
  SURefAdvancedClass,
  SURefCoreClass,
  SURefHybridClass,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefCrawler,
  SURefCreature,
  SURefDrone,
  SURefEquipment,
  SURefKeyword,
  SURefMeld,
  SURefModule,
  SURefNPC,
  SURefRollTable,
  SURefSquad,
  SURefSystem,
  SURefTrait,
  SURefVehicle,
} from './types/inferred.js'

export { BaseModel } from './BaseModel.js'

export { getDataMaps, getSchemaCatalog } from './ModelFactory.js'

export { resultForTable, type TableRollResult } from './utils/resultForTable.js'

export type {
  SURefEntity,
  SURefSchemaName,
  SURefEntityName,
} from './types/inferred.js'
export type * from './types/inferred.js'

// Type mapping from schema names to entity types
type SchemaToEntityMap = {
  vehicles: SURefVehicle
  creatures: SURefCreature
  drones: SURefDrone
  'bio-titans': SURefBioTitan
  npcs: SURefNPC
  squads: SURefSquad
  meld: SURefMeld
  keywords: SURefKeyword
  traits: SURefTrait
  systems: SURefSystem
  modules: SURefModule
  equipment: SURefEquipment
  abilities: SURefAbility
  'ability-tree-requirements': SURefAbilityTreeRequirement
  'roll-tables': SURefRollTable
  crawlers: SURefCrawler
  'crawler-tech-levels': SURefCrawlerTechLevel
  'classes.advanced': SURefAdvancedClass
  'classes.core': SURefCoreClass
  'classes.hybrid': SURefHybridClass
  'crawler-bays': SURefCrawlerBay
  chassis: SURefChassis
}

// Runtime mapping from schema names to model property names
const SchemaToModelMap = {
  vehicles: 'Vehicles',
  creatures: 'Creatures',
  drones: 'Drones',
  'bio-titans': 'BioTitans',
  npcs: 'NPCs',
  squads: 'Squads',
  meld: 'Meld',
  keywords: 'Keywords',
  traits: 'Traits',
  systems: 'Systems',
  modules: 'Modules',
  equipment: 'Equipment',
  abilities: 'Abilities',
  'ability-tree-requirements': 'AbilityTreeRequirements',
  'roll-tables': 'RollTables',
  crawlers: 'Crawlers',
  'crawler-tech-levels': 'CrawlerTechLevels',
  'classes.advanced': 'AdvancedClasses',
  'classes.core': 'CoreClasses',
  'classes.hybrid': 'HybridClasses',
  'crawler-bays': 'CrawlerBays',
  chassis: 'Chassis',
} as const

// Auto-generate models from schema catalog (synchronous)
const models = generateModels()

/**
 * Main entry point for Salvage Union data access
 * All models are auto-generated from the schema catalog
 */
export class SalvageUnionReference {
  public static readonly Abilities = models.Abilities as BaseModel<SURefAbility>
  public static readonly AbilityTreeRequirements =
    models.AbilityTreeRequirements as BaseModel<SURefAbilityTreeRequirement>
  public static readonly BioTitans =
    models.BioTitans as BaseModel<SURefBioTitan>
  public static readonly Chassis = models.Chassis as BaseModel<SURefChassis>
  public static readonly AdvancedClasses =
    models.AdvancedClasses as BaseModel<SURefAdvancedClass>
  public static readonly CoreClasses =
    models.CoreClasses as BaseModel<SURefCoreClass>
  public static readonly HybridClasses =
    models.HybridClasses as BaseModel<SURefHybridClass>
  public static readonly CrawlerBays =
    models.CrawlerBays as BaseModel<SURefCrawlerBay>
  public static readonly CrawlerTechLevels =
    models.CrawlerTechLevels as BaseModel<SURefCrawlerTechLevel>
  public static readonly Crawlers = models.Crawlers as BaseModel<SURefCrawler>
  public static readonly Creatures =
    models.Creatures as BaseModel<SURefCreature>
  public static readonly Drones = models.Drones as BaseModel<SURefDrone>
  public static readonly Equipment =
    models.Equipment as BaseModel<SURefEquipment>
  public static readonly Keywords = models.Keywords as BaseModel<SURefKeyword>
  public static readonly Meld = models.Meld as BaseModel<SURefMeld>
  public static readonly Modules = models.Modules as BaseModel<SURefModule>
  public static readonly NPCs = models.NPCs as BaseModel<SURefNPC>
  public static readonly RollTables =
    models.RollTables as BaseModel<SURefRollTable>
  public static readonly Squads = models.Squads as BaseModel<SURefSquad>
  public static readonly Systems = models.Systems as BaseModel<SURefSystem>
  public static readonly Traits = models.Traits as BaseModel<SURefTrait>
  public static readonly Vehicles = models.Vehicles as BaseModel<SURefVehicle>

  /**
   * Find a single record in a specific schema
   *
   * @param schemaName - The schema to search in (e.g., 'abilities', 'systems')
   * @param predicate - Function that returns true for the matching record
   * @returns The matching record or undefined
   *
   * @example
   * const ability = SalvageUnionReference.findIn('abilities', (a) => a.name === 'Hack')
   * const system = SalvageUnionReference.findIn('systems', (s) => s.techLevel === 3)
   */
  public static findIn<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    predicate: (item: SchemaToEntityMap[T]) => boolean
  ): SchemaToEntityMap[T] | undefined {
    const modelName = SchemaToModelMap[schemaName]
    const model = SalvageUnionReference[
      modelName as keyof typeof SalvageUnionReference
    ] as BaseModel<SchemaToEntityMap[T]>
    return model.find(predicate)
  }

  /**
   * Find all matching records in a specific schema
   *
   * @param schemaName - The schema to search in (e.g., 'abilities', 'systems')
   * @param predicate - Function that returns true for matching records
   * @returns Array of matching records
   *
   * @example
   * const level3Abilities = SalvageUnionReference.findAllIn('abilities', (a) => a.level === 3)
   * const energyWeapons = SalvageUnionReference.findAllIn('systems', (s) =>
   *   s.traits?.some((t) => t.type === 'energy')
   * )
   */
  public static findAllIn<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    predicate: (item: SchemaToEntityMap[T]) => boolean
  ): SchemaToEntityMap[T][] {
    const modelName = SchemaToModelMap[schemaName]
    const model = SalvageUnionReference[
      modelName as keyof typeof SalvageUnionReference
    ] as BaseModel<SchemaToEntityMap[T]>
    return model.findAll(predicate)
  }
}
