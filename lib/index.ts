/**
 * Salvage Union Data ORM
 *
 * Type-safe query interface for Salvage Union game data
 * Models are auto-generated from the schema catalog
 *
 * DO NOT EDIT MANUALLY - Run 'npm run generate:index' to regenerate
 */

import { BaseModel, type ModelWithMetadata } from './BaseModel.js'
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
} from './types/generated.js'
import {
  search as searchFn,
  searchIn as searchInFn,
  getSuggestions as getSuggestionsFn,
} from './search.js'

export { BaseModel } from './BaseModel.js'

export {
  getDataMaps,
  getSchemaCatalog,
  type EnhancedSchemaMetadata,
} from './ModelFactory.js'

export { resultForTable, type TableRollResult } from './utils/resultForTable.js'

// Export utility functions (type guards and property extractors)
export * from './utilities.js'

export {
  search,
  searchIn,
  getSuggestions,
  type SearchOptions,
  type SearchResult,
} from './search.js'

export type * from './types/generated.js'

// Type mapping from schema names to entity types
type SchemaToEntityMap = {
  abilities: SURefAbility
  'ability-tree-requirements': SURefAbilityTreeRequirement
  'bio-titans': SURefBioTitan
  chassis: SURefChassis
  'classes.advanced': SURefAdvancedClass
  'classes.core': SURefCoreClass
  'classes.hybrid': SURefHybridClass
  'crawler-bays': SURefCrawlerBay
  'crawler-tech-levels': SURefCrawlerTechLevel
  crawlers: SURefCrawler
  creatures: SURefCreature
  drones: SURefDrone
  equipment: SURefEquipment
  keywords: SURefKeyword
  meld: SURefMeld
  modules: SURefModule
  npcs: SURefNPC
  'roll-tables': SURefRollTable
  squads: SURefSquad
  systems: SURefSystem
  traits: SURefTrait
  vehicles: SURefVehicle
}

// Runtime mapping from schema names to model property names
const SchemaToModelMap = {
  abilities: 'Abilities',
  'ability-tree-requirements': 'AbilityTreeRequirements',
  'bio-titans': 'BioTitans',
  chassis: 'Chassis',
  'classes.advanced': 'AdvancedClasses',
  'classes.core': 'CoreClasses',
  'classes.hybrid': 'HybridClasses',
  'crawler-bays': 'CrawlerBays',
  'crawler-tech-levels': 'CrawlerTechLevels',
  crawlers: 'Crawlers',
  creatures: 'Creatures',
  drones: 'Drones',
  equipment: 'Equipment',
  keywords: 'Keywords',
  meld: 'Meld',
  modules: 'Modules',
  npcs: 'NPCs',
  'roll-tables': 'RollTables',
  squads: 'Squads',
  systems: 'Systems',
  traits: 'Traits',
  vehicles: 'Vehicles',
} as const

// Runtime mapping from schema names to display names
export const SchemaToDisplayName = {
  abilities: 'Abilities',
  'ability-tree-requirements': 'Ability Tree Requirements',
  'bio-titans': 'Bio-Titans',
  chassis: 'Chassis',
  'classes.advanced': 'Advanced Classes',
  'classes.core': 'Core Classes',
  'classes.hybrid': 'Hybrid Classes',
  'crawler-bays': 'Crawler Bays',
  'crawler-tech-levels': 'Crawler Tech Levels',
  crawlers: 'Crawlers',
  creatures: 'Creatures',
  drones: 'Drones',
  equipment: 'Equipment',
  keywords: 'Keywords',
  meld: 'Meld',
  modules: 'Modules',
  npcs: 'NPCs',
  'roll-tables': 'Roll Tables',
  squads: 'Squads',
  systems: 'Systems',
  traits: 'Traits',
  vehicles: 'Vehicles',
} as const

// Auto-generate models from schema catalog (synchronous)
const models = generateModels()

// Union type for all entity types
export type SURefEntity =
  | SURefAbility
  | SURefAbilityTreeRequirement
  | SURefBioTitan
  | SURefChassis
  | SURefAdvancedClass
  | SURefCoreClass
  | SURefHybridClass
  | SURefCrawlerBay
  | SURefCrawlerTechLevel
  | SURefCrawler
  | SURefCreature
  | SURefDrone
  | SURefEquipment
  | SURefKeyword
  | SURefMeld
  | SURefModule
  | SURefNPC
  | SURefRollTable
  | SURefSquad
  | SURefSystem
  | SURefTrait
  | SURefVehicle

// Union type for all schema names
export type SURefSchemaName = keyof SchemaToEntityMap

/**
 * Main ORM class with static model accessors
 */
export class SalvageUnionReference {
  // Initialize static properties from generated models
  static Abilities = models.Abilities as ModelWithMetadata<
    SchemaToEntityMap['abilities']
  >
  static AbilityTreeRequirements =
    models.AbilityTreeRequirements as ModelWithMetadata<
      SchemaToEntityMap['ability-tree-requirements']
    >
  static BioTitans = models.BioTitans as ModelWithMetadata<
    SchemaToEntityMap['bio-titans']
  >
  static Chassis = models.Chassis as ModelWithMetadata<
    SchemaToEntityMap['chassis']
  >
  static AdvancedClasses = models.AdvancedClasses as ModelWithMetadata<
    SchemaToEntityMap['classes.advanced']
  >
  static CoreClasses = models.CoreClasses as ModelWithMetadata<
    SchemaToEntityMap['classes.core']
  >
  static HybridClasses = models.HybridClasses as ModelWithMetadata<
    SchemaToEntityMap['classes.hybrid']
  >
  static CrawlerBays = models.CrawlerBays as ModelWithMetadata<
    SchemaToEntityMap['crawler-bays']
  >
  static CrawlerTechLevels = models.CrawlerTechLevels as ModelWithMetadata<
    SchemaToEntityMap['crawler-tech-levels']
  >
  static Crawlers = models.Crawlers as ModelWithMetadata<
    SchemaToEntityMap['crawlers']
  >
  static Creatures = models.Creatures as ModelWithMetadata<
    SchemaToEntityMap['creatures']
  >
  static Drones = models.Drones as ModelWithMetadata<
    SchemaToEntityMap['drones']
  >
  static Equipment = models.Equipment as ModelWithMetadata<
    SchemaToEntityMap['equipment']
  >
  static Keywords = models.Keywords as ModelWithMetadata<
    SchemaToEntityMap['keywords']
  >
  static Meld = models.Meld as ModelWithMetadata<SchemaToEntityMap['meld']>
  static Modules = models.Modules as ModelWithMetadata<
    SchemaToEntityMap['modules']
  >
  static NPCs = models.NPCs as ModelWithMetadata<SchemaToEntityMap['npcs']>
  static RollTables = models.RollTables as ModelWithMetadata<
    SchemaToEntityMap['roll-tables']
  >
  static Squads = models.Squads as ModelWithMetadata<
    SchemaToEntityMap['squads']
  >
  static Systems = models.Systems as ModelWithMetadata<
    SchemaToEntityMap['systems']
  >
  static Traits = models.Traits as ModelWithMetadata<
    SchemaToEntityMap['traits']
  >
  static Vehicles = models.Vehicles as ModelWithMetadata<
    SchemaToEntityMap['vehicles']
  >

  /**
   * Find a single entity in a specific schema
   *
   * @param schemaName - The schema to search in
   * @param predicate - Function to test each entity
   * @returns The first matching entity or undefined
   *
   * @example
   * const ability = SalvageUnionReference.findIn('abilities', a => a.name === 'Bionic Senses')
   */
  public static findIn<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    predicate: (entity: SchemaToEntityMap[T]) => boolean
  ): SchemaToEntityMap[T] | undefined {
    const modelName = SchemaToModelMap[schemaName]
    const model = models[modelName] as BaseModel<SchemaToEntityMap[T]>
    return model.find(predicate)
  }

  /**
   * Find all entities matching a predicate in a specific schema
   *
   * @param schemaName - The schema to search in
   * @param predicate - Function to test each entity
   * @returns Array of matching entities
   *
   * @example
   * const level1Abilities = SalvageUnionReference.findAllIn('abilities', a => a.level === 1)
   */
  public static findAllIn<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    predicate: (entity: SchemaToEntityMap[T]) => boolean
  ): SchemaToEntityMap[T][] {
    const modelName = SchemaToModelMap[schemaName]
    const model = models[modelName] as BaseModel<SchemaToEntityMap[T]>
    return model.findAll(predicate)
  }

  // Entity cache for O(1) lookups
  private static entityCache = new Map<string, SURefEntity>()

  /**
   * Get an entity by schema name and ID (O(1) with caching)
   *
   * @param schemaName - The schema to search in
   * @param id - The entity ID
   * @returns The entity or undefined if not found
   *
   * @example
   * const ability = SalvageUnionReference.get('abilities', 'bionic-senses')
   */
  public static get<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    id: string
  ): SchemaToEntityMap[T] | undefined {
    const cacheKey = `${schemaName}::${id}`

    // Check cache first
    if (this.entityCache.has(cacheKey)) {
      return this.entityCache.get(cacheKey) as SchemaToEntityMap[T]
    }

    // Find entity
    const entity = this.findIn(
      schemaName,
      (e: SchemaToEntityMap[T]) => e.id === id
    )

    // Cache if found
    if (entity) {
      this.entityCache.set(cacheKey, entity)
    }

    return entity
  }

  /**
   * Check if an entity exists by schema name and ID
   *
   * @param schemaName - The schema to check
   * @param id - The entity ID
   * @returns True if the entity exists
   *
   * @example
   * if (SalvageUnionReference.exists('abilities', 'bionic-senses')) { ... }
   */
  public static exists<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    id: string
  ): boolean {
    return this.get(schemaName, id) !== undefined
  }

  /**
   * Get multiple entities by schema name and IDs
   *
   * @param requests - Array of {schemaName, id} objects
   * @returns Array of entities (undefined for IDs not found)
   *
   * @example
   * const entities = SalvageUnionReference.getMany([
   *   { schemaName: 'abilities', id: 'bionic-senses' },
   *   { schemaName: 'systems', id: 'energy-shield' }
   * ])
   */
  public static getMany(
    requests: Array<{ schemaName: keyof SchemaToEntityMap; id: string }>
  ): (SURefEntity | undefined)[] {
    return requests.map((req) => this.get(req.schemaName, req.id))
  }

  /**
   * Compose a reference string from schema name and ID
   *
   * @param schemaName - The schema name
   * @param id - The entity ID
   * @returns Reference string in format "schemaName::id"
   *
   * @example
   * const ref = SalvageUnionReference.composeRef('abilities', 'bionic-senses')
   * // => 'abilities::bionic-senses'
   */
  public static composeRef<T extends keyof SchemaToEntityMap>(
    schemaName: T,
    id: string
  ): string {
    return `${schemaName}::${id}`
  }

  /**
   * Parse a reference string into schema name and ID
   *
   * @param ref - Reference string in format "schemaName::id"
   * @returns Object with schemaName and id, or null if invalid
   *
   * @example
   * const parsed = SalvageUnionReference.parseRef('abilities::bionic-senses')
   * // => { schemaName: 'abilities', id: 'bionic-senses' }
   */
  public static parseRef(
    ref: string
  ): { schemaName: keyof SchemaToEntityMap; id: string } | null {
    const parts = ref.split('::')
    if (parts.length !== 2) return null

    const schemaName = parts[0] as keyof SchemaToEntityMap
    const id = parts[1]

    // Validate schema name
    if (!SchemaToModelMap[schemaName]) return null

    return { schemaName, id }
  }

  /**
   * Get an entity by reference string
   *
   * @param ref - Reference string in format "schemaName::id"
   * @returns The entity or undefined if not found
   *
   * @example
   * const ability = SalvageUnionReference.getByRef('abilities::bionic-senses')
   */
  public static getByRef(ref: string): SURefEntity | undefined {
    const parsed = this.parseRef(ref)
    if (!parsed) return undefined

    return this.get(parsed.schemaName, parsed.id)
  }

  /**
   * Search across all schemas or specific schemas
   */
  public static search = searchFn

  /**
   * Search within a specific schema
   */
  public static searchIn = searchInFn

  /**
   * Get search suggestions
   */
  public static getSuggestions = getSuggestionsFn
}
