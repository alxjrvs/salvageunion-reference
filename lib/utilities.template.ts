/**
 * Auto-generated utility functions for Salvage Union entities
 * Generated from schema catalog
 * DO NOT EDIT MANUALLY - Run 'npm run generate:utilities' to regenerate
 */

import type { SURefEntity } from './index.js'
// INJECT:TYPE_IMPORTS

// ============================================================================
// TYPE GUARD HELPERS
// ============================================================================

/**
 * Helper function to check if an entity has all required fields
 * @param entity - The entity to check
 * @param requiredFields - Array of required field names
 * @returns True if entity is valid and has all required fields
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasRequiredFields(
  entity: unknown,
  requiredFields: string[]
): entity is SURefEntity {
  if (!entity || typeof entity !== 'object') return false
  return requiredFields.every((field) => field in entity)
}

// ============================================================================
// TYPE GUARDS
// ============================================================================
// INJECT:TYPE_GUARDS

// ============================================================================
// PROPERTY EXTRACTOR HELPERS
// ============================================================================

/**
 * Generic helper to extract a property from an entity
 * @param entity - The entity to extract from
 * @param propertyName - The property name to extract
 * @returns The property value or undefined
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractProperty<T>(
  entity: SURefEntity,
  propertyName: string
): T | undefined {
  return propertyName in entity
    ? (entity as unknown as Record<string, T>)[propertyName]
    : undefined
}

// ============================================================================
// PROPERTY EXTRACTORS
// ============================================================================
// INJECT:PROPERTY_EXTRACTORS

// ============================================================================
// ADDITIONAL TYPE GUARDS FOR COMMON PATTERNS
// ============================================================================

/**
 * Type guard to check if an entity has a techLevel property
 * Entities with techLevel: Chassis, Systems, Modules, Drones, Vehicles
 * @param entity - The entity to check
 * @returns True if the entity has a techLevel property
 */
export function hasTechLevel(
  entity: SURefEntity
): entity is SURefEntity & { techLevel: number } {
  return 'techLevel' in entity && typeof entity.techLevel === 'number'
}

/**
 * Type guard to check if an entity has a salvageValue property
 * Entities with salvageValue: Chassis, Systems, Modules, Drones, Vehicles, Meld
 * @param entity - The entity to check
 * @returns True if the entity has a salvageValue property
 */
export function hasSalvageValue(
  entity: SURefEntity
): entity is SURefEntity & { salvageValue: number } {
  return 'salvageValue' in entity && typeof entity.salvageValue === 'number'
}

/**
 * Type guard to check if an entity has a slotsRequired property
 * Entities with slotsRequired: Systems, Modules
 * @param entity - The entity to check
 * @returns True if the entity has a slotsRequired property
 */
export function hasSlotsRequired(
  entity: SURefEntity
): entity is SURefEntity & { slotsRequired: number } {
  return 'slotsRequired' in entity && typeof entity.slotsRequired === 'number'
}

/**
 * Extract slots required from an entity
 * Entities with slotsRequired: Systems, Modules
 * @param entity - The entity to extract from
 * @returns The slotsRequired value or undefined
 */
export function getSlotsRequired(entity: SURefEntity): number | undefined {
  return 'slotsRequired' in entity && typeof entity.slotsRequired === 'number'
    ? entity.slotsRequired
    : undefined
}

/**
 * Type guard to check if an entity has actions
 * Entities with actions: Chassis, Bio-Titans, Crawler Bays, Creatures, Meld, Modules, NPCs, Squads, Systems
 * @param entity - The entity to check
 * @returns True if the entity has an actions array
 */
export function hasActions(
  entity: SURefEntity
): entity is SURefEntity & { actions: unknown[] } {
  return 'actions' in entity && Array.isArray(entity.actions)
}

/**
 * Type guard to check if an entity has traits
 * Entities with traits: Creatures, Meld, Modules, NPCs, Squads, Systems, Vehicles
 * @param entity - The entity to check
 * @returns True if the entity has a traits array
 */
export function hasTraits(
  entity: SURefEntity
): entity is SURefEntity & { traits?: unknown[] } {
  return (
    'traits' in entity &&
    (entity.traits === undefined || Array.isArray(entity.traits))
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
