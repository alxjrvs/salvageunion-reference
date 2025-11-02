/**
 * Auto-generated utility functions for Salvage Union entities
 * Generated from schema catalog
 * DO NOT EDIT MANUALLY - Run 'npm run generate:utilities' to regenerate
 */

import type { SURefEntity } from './index.js'
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

// ============================================================================
// TYPE GUARD HELPERS
// ============================================================================

/**
 * Helper function to check if an entity has all required fields
 * @param entity - The entity to check
 * @param requiredFields - Array of required field names
 * @returns True if entity is valid and has all required fields
 */

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

/**
 * Type guard to check if an entity is a Ability
 * Checks if the entity has the required fields for the 'abilities' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Ability type
 */
export function isAbility(entity: SURefEntity): entity is SURefAbility {
  return hasRequiredFields(entity, ['tree', 'level'])
}

/**
 * Type guard to check if an entity is a AbilityTreeRequirement
 * Checks if the entity has the required fields for the 'ability-tree-requirements' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the AbilityTreeRequirement type
 */
export function isAbilityTreeRequirement(
  entity: SURefEntity
): entity is SURefAbilityTreeRequirement {
  return hasRequiredFields(entity, ['requirement'])
}

/**
 * Type guard to check if an entity is a BioTitan
 * Checks if the entity has the required fields for the 'bio-titans' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the BioTitan type
 */
export function isBioTitan(entity: SURefEntity): entity is SURefBioTitan {
  return hasRequiredFields(entity, ['structurePoints', 'actions'])
}

/**
 * Type guard to check if an entity is a Chassis
 * Checks if the entity has the required fields for the 'chassis' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Chassis type
 */
export function isChassis(entity: SURefEntity): entity is SURefChassis {
  return hasRequiredFields(entity, [
    'actions',
    'patterns',
    'structurePts',
    'energyPts',
    'heatCap',
    'systemSlots',
    'moduleSlots',
    'cargoCap',
    'techLevel',
    'salvageValue',
  ])
}

/**
 * Type guard to check if an entity is a AdvancedClass
 * Checks if the entity has the required fields for the 'classes.advanced' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the AdvancedClass type
 */
export function isAdvancedClass(
  entity: SURefEntity
): entity is SURefAdvancedClass {
  return hasRequiredFields(entity, ['advancedTree', 'legendaryTree'])
}

/**
 * Type guard to check if an entity is a CoreClass
 * Checks if the entity has the required fields for the 'classes.core' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the CoreClass type
 */
export function isCoreClass(entity: SURefEntity): entity is SURefCoreClass {
  return hasRequiredFields(entity, ['maxAbilities', 'advanceable', 'coreTrees'])
}

/**
 * Type guard to check if an entity is a HybridClass
 * Checks if the entity has the required fields for the 'classes.hybrid' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the HybridClass type
 */
export function isHybridClass(entity: SURefEntity): entity is SURefHybridClass {
  return hasRequiredFields(entity, ['advancedTree', 'legendaryTree'])
}

/**
 * Type guard to check if an entity is a CrawlerBay
 * Checks if the entity has the required fields for the 'crawler-bays' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the CrawlerBay type
 */
export function isCrawlerBay(entity: SURefEntity): entity is SURefCrawlerBay {
  return hasRequiredFields(entity, [
    'damagedEffect',
    'npc',
    'actions',
    'techLevelEffects',
  ])
}

/**
 * Type guard to check if an entity is a CrawlerTechLevel
 * Checks if the entity has the required fields for the 'crawler-tech-levels' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the CrawlerTechLevel type
 */
export function isCrawlerTechLevel(
  entity: SURefEntity
): entity is SURefCrawlerTechLevel {
  return hasRequiredFields(entity, [
    'techLevel',
    'structurePoints',
    'populationMin',
    'populationMax',
  ])
}

/**
 * Type guard to check if an entity is a Crawler
 * Checks if the entity has the required fields for the 'crawlers' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Crawler type
 */
export function isCrawler(entity: SURefEntity): entity is SURefCrawler {
  return hasRequiredFields(entity, ['npc', 'actions'])
}

/**
 * Type guard to check if an entity is a Creature
 * Checks if the entity has the required fields for the 'creatures' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Creature type
 */
export function isCreature(entity: SURefEntity): entity is SURefCreature {
  return hasRequiredFields(entity, ['hitPoints', 'actions'])
}

/**
 * Type guard to check if an entity is a Drone
 * Checks if the entity has the required fields for the 'drones' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Drone type
 */
export function isDrone(entity: SURefEntity): entity is SURefDrone {
  return hasRequiredFields(entity, [
    'structurePoints',
    'techLevel',
    'salvageValue',
    'systems',
  ])
}

/**
 * Type guard to check if an entity is a Equipment
 * Checks if the entity has the required fields for the 'equipment' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Equipment type
 */
export function isEquipment(entity: SURefEntity): entity is SURefEquipment {
  return hasRequiredFields(entity, ['techLevel'])
}

/**
 * Type guard to check if an entity is a Keyword
 * Checks if the entity has the required fields for the 'keywords' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Keyword type
 */
export function isKeyword(entity: SURefEntity): entity is SURefKeyword {
  return hasRequiredFields(entity, [])
}

/**
 * Type guard to check if an entity is a Meld
 * Checks if the entity has the required fields for the 'meld' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Meld type
 */
export function isMeld(entity: SURefEntity): entity is SURefMeld {
  return hasRequiredFields(entity, ['actions'])
}

/**
 * Type guard to check if an entity is a Module
 * Checks if the entity has the required fields for the 'modules' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Module type
 */
export function isModule(entity: SURefEntity): entity is SURefModule {
  return hasRequiredFields(entity, [
    'actions',
    'salvageValue',
    'slotsRequired',
    'techLevel',
  ])
}

/**
 * Type guard to check if an entity is a NPC
 * Checks if the entity has the required fields for the 'npcs' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the NPC type
 */
export function isNPC(entity: SURefEntity): entity is SURefNPC {
  return hasRequiredFields(entity, ['hitPoints', 'actions'])
}

/**
 * Type guard to check if an entity is a RollTable
 * Checks if the entity has the required fields for the 'roll-tables' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the RollTable type
 */
export function isRollTable(entity: SURefEntity): entity is SURefRollTable {
  return hasRequiredFields(entity, ['section', 'table'])
}

/**
 * Type guard to check if an entity is a Squad
 * Checks if the entity has the required fields for the 'squads' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Squad type
 */
export function isSquad(entity: SURefEntity): entity is SURefSquad {
  return hasRequiredFields(entity, ['actions'])
}

/**
 * Type guard to check if an entity is a System
 * Checks if the entity has the required fields for the 'systems' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the System type
 */
export function isSystem(entity: SURefEntity): entity is SURefSystem {
  return hasRequiredFields(entity, [
    'actions',
    'salvageValue',
    'slotsRequired',
    'techLevel',
  ])
}

/**
 * Type guard to check if an entity is a Trait
 * Checks if the entity has the required fields for the 'traits' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Trait type
 */
export function isTrait(entity: SURefEntity): entity is SURefTrait {
  return hasRequiredFields(entity, [])
}

/**
 * Type guard to check if an entity is a Vehicle
 * Checks if the entity has the required fields for the 'vehicles' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Vehicle type
 */
export function isVehicle(entity: SURefEntity): entity is SURefVehicle {
  return hasRequiredFields(entity, [
    'structurePoints',
    'techLevel',
    'salvageValue',
    'systems',
  ])
}

// ============================================================================
// PROPERTY EXTRACTOR HELPERS
// ============================================================================

/**
 * Generic helper to extract a property from an entity
 * @param entity - The entity to extract from
 * @param propertyName - The property name to extract
 * @returns The property value or undefined
 */

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

/**
 * Extract structurePoints from an entity if it exists
 * Supported schemas: bio-titans, crawler-tech-levels, drones, meld, vehicles
 * @param entity - The entity to extract from
 * @returns The structurePoints value or undefined
 */
export function getStructurePoints(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'structurePoints')
}

/**
 * Extract actions from an entity if it exists
 * Supported schemas: bio-titans, chassis, crawler-bays, crawlers, creatures, equipment, meld, npcs, squads
 * @param entity - The entity to extract from
 * @returns The actions value or undefined
 */
export function getActions(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'actions')
}

/**
 * Extract traits from an entity if it exists
 * Supported schemas: bio-titans, creatures, equipment, meld, npcs, squads, vehicles
 * @param entity - The entity to extract from
 * @returns The traits value or undefined
 */
export function getTraits(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'traits')
}

/**
 * Extract npc from an entity if it exists
 * Supported schemas: chassis, crawler-bays, crawlers
 * @param entity - The entity to extract from
 * @returns The npc value or undefined
 */
export function getNpc(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'npc')
}

/**
 * Extract advancedTree from an entity if it exists
 * Supported schemas: classes.advanced, classes.hybrid
 * @param entity - The entity to extract from
 * @returns The advancedTree value or undefined
 */
export function getAdvancedTree(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'advancedTree')
}

/**
 * Extract legendaryTree from an entity if it exists
 * Supported schemas: classes.advanced, classes.hybrid
 * @param entity - The entity to extract from
 * @returns The legendaryTree value or undefined
 */
export function getLegendaryTree(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'legendaryTree')
}

/**
 * Extract table from an entity if it exists
 * Supported schemas: crawler-bays, equipment, roll-tables
 * @param entity - The entity to extract from
 * @returns The table value or undefined
 */
export function getTable(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'table')
}

/**
 * Extract techLevel from an entity if it exists
 * Supported schemas: crawler-tech-levels, drones, equipment, vehicles
 * @param entity - The entity to extract from
 * @returns The techLevel value or undefined
 */
export function getTechLevel(entity: SURefEntity): number | undefined {
  return extractProperty<number>(entity, 'techLevel')
}

/**
 * Extract hitPoints from an entity if it exists
 * Supported schemas: creatures, meld, npcs, squads
 * @param entity - The entity to extract from
 * @returns The hitPoints value or undefined
 */
export function getHitPoints(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'hitPoints')
}

/**
 * Extract salvageValue from an entity if it exists
 * Supported schemas: drones, meld, vehicles
 * @param entity - The entity to extract from
 * @returns The salvageValue value or undefined
 */
export function getSalvageValue(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'salvageValue')
}

/**
 * Extract systems from an entity if it exists
 * Supported schemas: drones, vehicles
 * @param entity - The entity to extract from
 * @returns The systems value or undefined
 */
export function getSystems(entity: SURefEntity): unknown | undefined {
  return extractProperty<unknown>(entity, 'systems')
}

/**
 * Extract page reference from an entity
 * All entities have a page reference from the entry definition
 * @param entity - The entity to extract from
 * @returns The page number or undefined
 */
export function getPageReference(entity: SURefEntity): number | undefined {
  return extractProperty<number>(entity, 'page')
}

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
