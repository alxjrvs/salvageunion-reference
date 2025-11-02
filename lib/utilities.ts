/**
 * Utility functions for Salvage Union entities
 * Manually defined type guards and property extractors
 */

import type { SURefEntity } from './index.js'
import type { SURefMetaEntity } from './types/generated.js'
import type {
  SURefAbility,
  SURefAdvancedClass,
  SURefChassis,
  SURefCoreClass,
  SURefHybridClass,
  SURefModule,
  SURefSystem,
} from './types/generated.js'

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Get all possible keys from a union type
 */
type AllKeys<T> = T extends unknown ? keyof T : never

/**
 * All possible property keys across all SURefMetaEntity types
 */
type SURefMetaEntityKeys = AllKeys<SURefMetaEntity>

/**
 * Get the type of a property across all types in the union
 * Returns the union of all possible types for that property
 */
type PropertyType<T, K extends PropertyKey> = T extends unknown
  ? K extends keyof T
    ? T[K]
    : never
  : never

// ============================================================================
// PROPERTY EXTRACTORS
// ============================================================================

/**
 * Type-safe property extractor for SURefMetaEntity
 * @param entity - The entity to extract from
 * @param propertyName - The property name to extract
 * @returns The property value or undefined if not present
 */
export function extractProperty<K extends SURefMetaEntityKeys>(
  entity: SURefMetaEntity,
  propertyName: K
): PropertyType<SURefMetaEntity, K> | undefined {
  if (entity !== null && typeof entity === 'object' && propertyName in entity) {
    return (entity as unknown as Record<string, unknown>)[
      propertyName as string
    ] as PropertyType<SURefMetaEntity, K>
  }
  return undefined
}

/**
 * Extract tech level from an entity
 * @param entity - The entity to extract from
 * @returns The tech level or undefined
 */
export function getTechLevel(entity: SURefMetaEntity): number | undefined {
  if ('techLevel' in entity && typeof entity.techLevel === 'number') {
    return entity.techLevel
  }
  // Check stats object for chassis
  if (
    'stats' in entity &&
    entity.stats &&
    typeof entity.stats === 'object' &&
    'techLevel' in entity.stats &&
    typeof entity.stats.techLevel === 'number'
  ) {
    return entity.stats.techLevel
  }
  return undefined
}

/**
 * Extract salvage value from an entity
 * @param entity - The entity to extract from
 * @returns The salvage value or undefined
 */
export function getSalvageValue(entity: SURefMetaEntity): number | undefined {
  if ('salvageValue' in entity && typeof entity.salvageValue === 'number') {
    return entity.salvageValue
  }
  // Check stats object for chassis
  if (
    'stats' in entity &&
    entity.stats &&
    typeof entity.stats === 'object' &&
    'salvageValue' in entity.stats &&
    typeof entity.stats.salvageValue === 'number'
  ) {
    return entity.stats.salvageValue
  }
  return undefined
}

/**
 * Extract slots required from an entity
 * @param entity - The entity to extract from
 * @returns The slots required or undefined
 */
export function getSlotsRequired(entity: SURefMetaEntity): number | undefined {
  return 'slotsRequired' in entity && typeof entity.slotsRequired === 'number'
    ? entity.slotsRequired
    : undefined
}

/**
 * Extract page reference from an entity
 * @param entity - The entity to extract from
 * @returns The page number or undefined
 */
export function getPageReference(entity: SURefMetaEntity): number | undefined {
  return 'page' in entity && typeof entity.page === 'number'
    ? entity.page
    : undefined
}

// ============================================================================
// TYPE GUARDS - Property-based
// ============================================================================

/**
 * Type guard to check if an entity has a techLevel property
 * @param entity - The entity to check
 * @returns True if the entity has a techLevel property
 */
export function hasTechLevel(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { techLevel: number } {
  return 'techLevel' in entity && typeof entity.techLevel === 'number'
}

/**
 * Type guard to check if an entity has a salvageValue property
 * @param entity - The entity to check
 * @returns True if the entity has a salvageValue property
 */
export function hasSalvageValue(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { salvageValue: number } {
  return 'salvageValue' in entity && typeof entity.salvageValue === 'number'
}

/**
 * Type guard to check if an entity has a slotsRequired property
 * @param entity - The entity to check
 * @returns True if the entity has a slotsRequired property
 */
export function hasSlotsRequired(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { slotsRequired: number } {
  return 'slotsRequired' in entity && typeof entity.slotsRequired === 'number'
}

/**
 * Type guard to check if an entity has actions
 * @param entity - The entity to check
 * @returns True if the entity has an actions array
 */
export function hasActions(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { actions: unknown[] } {
  return 'actions' in entity && Array.isArray(entity.actions)
}

/**
 * Type guard to check if an entity has traits
 * @param entity - The entity to check
 * @returns True if the entity has a traits property
 */
export function hasTraits(
  entity: SURefMetaEntity
): entity is SURefMetaEntity & { traits?: unknown[] } {
  return (
    'traits' in entity &&
    (entity.traits === undefined || Array.isArray(entity.traits))
  )
}

// ============================================================================
// TYPE GUARDS - Schema-specific
// ============================================================================

/**
 * Type guard to check if an entity is an Ability
 * @param entity - The entity to check
 * @returns True if the entity is an Ability
 */
export function isAbility(entity: SURefEntity): entity is SURefAbility {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'tree' in entity &&
    'level' in entity
  )
}

/**
 * Type guard to check if an entity is a System
 * Note: Systems and Modules share the same schema, so this checks for
 * the presence of required system/module properties
 * @param entity - The entity to check
 * @returns True if the entity is a System
 */
export function isSystem(entity: SURefEntity): entity is SURefSystem {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'techLevel' in entity &&
    'salvageValue' in entity &&
    'slotsRequired' in entity &&
    'actions' in entity
  )
}

/**
 * Type guard to check if an entity is a Module
 * Note: Systems and Modules share the same schema, so this checks for
 * the presence of required system/module properties
 * @param entity - The entity to check
 * @returns True if the entity is a Module
 */
export function isModule(entity: SURefEntity): entity is SURefModule {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'techLevel' in entity &&
    'salvageValue' in entity &&
    'slotsRequired' in entity &&
    'actions' in entity
  )
}

/**
 * Type guard to check if an entity is a Chassis
 * @param entity - The entity to check
 * @returns True if the entity is a Chassis
 */
export function isChassis(entity: SURefEntity): entity is SURefChassis {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'patterns' in entity &&
    'structurePts' in entity &&
    'energyPts' in entity &&
    'heatCap' in entity
  )
}

/**
 * Type guard to check if an entity is a Core Class
 * @param entity - The entity to check
 * @returns True if the entity is a Core Class
 */
export function isCoreClass(entity: SURefEntity): entity is SURefCoreClass {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'maxAbilities' in entity &&
    'coreTrees' in entity &&
    'advanceable' in entity
  )
}

/**
 * Type guard to check if an entity is an Advanced Class
 * @param entity - The entity to check
 * @returns True if the entity is an Advanced Class
 */
export function isAdvancedClass(
  entity: SURefEntity
): entity is SURefAdvancedClass {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'advancedTree' in entity &&
    !('hybridTree' in entity)
  )
}

/**
 * Type guard to check if an entity is a Hybrid Class
 * @param entity - The entity to check
 * @returns True if the entity is a Hybrid Class
 */
export function isHybridClass(entity: SURefEntity): entity is SURefHybridClass {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'advancedTree' in entity &&
    'hybridTree' in entity
  )
}

/**
 * Type guard to check if an entity is a class (any type)
 * @param entity - The entity to check
 * @returns True if the entity is a Core, Advanced, or Hybrid class
 */
export function isClass(
  entity: SURefEntity
): entity is SURefCoreClass | SURefAdvancedClass | SURefHybridClass {
  return isCoreClass(entity) || isAdvancedClass(entity) || isHybridClass(entity)
}

/**
 * Type guard to check if an entity is a System or Module
 * @param entity - The entity to check
 * @returns True if the entity is a System or Module
 */
export function isSystemOrModule(
  entity: SURefEntity
): entity is SURefSystem | SURefModule {
  return isSystem(entity) || isModule(entity)
}
