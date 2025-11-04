/**
 * Auto-generated TypeScript types for Salvage Union
 *
 * This file re-exports all generated types from the individual type files.
 */

// Export all enum types
export * from './enums.js'

// Export all common types
export * from './common.js'

// Export all object types
export * from './objects.js'

// Export all schema types
export * from './schemas.js'

// Import schema types for union type
import type {
  SURefAbility,
  SURefAbilityTreeRequirement,
  SURefBioTitan,
  SURefChassis,
  SURefAdvancedClass,
  SURefCoreClass,
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
} from './schemas.js'

// Import object types for union type
import type { SURefMetaAction } from './objects.js'

// Import enum types for union type
import type { SURefSchemaName } from './enums.js'

// Union type for all entity types
export type SURefEntity =
  | SURefAbility
  | SURefAbilityTreeRequirement
  | SURefBioTitan
  | SURefChassis
  | SURefAdvancedClass
  | SURefCoreClass
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

// Union type for all entities and meta actions
export type SURefMetaEntity = SURefEntity | SURefMetaAction

// Union type for all schema names including meta actions
export type SURefMetaSchemaName = SURefSchemaName | 'actions'
