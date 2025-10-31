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
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if an entity is a Ability
 * Checks if the entity has the required fields for the 'abilities' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Ability type
 */
export function isAbility(entity: SURefEntity): entity is SURefAbility {
  if (!entity || typeof entity !== 'object') return false
  if (!('tree' in entity)) return false
  if (!('level' in entity)) return false
  return true
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
  if (!entity || typeof entity !== 'object') return false
  if (!('requirement' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a BioTitan
 * Checks if the entity has the required fields for the 'bio-titans' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the BioTitan type
 */
export function isBioTitan(entity: SURefEntity): entity is SURefBioTitan {
  if (!entity || typeof entity !== 'object') return false
  if (!('structurePoints' in entity)) return false
  if (!('actions' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Chassis
 * Checks if the entity has the required fields for the 'chassis' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Chassis type
 */
export function isChassis(entity: SURefEntity): entity is SURefChassis {
  if (!entity || typeof entity !== 'object') return false
  if (!('stats' in entity)) return false
  if (!('actions' in entity)) return false
  if (!('patterns' in entity)) return false
  return true
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
  if (!entity || typeof entity !== 'object') return false
  if (!('advancedTree' in entity)) return false
  if (!('legendaryTree' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a CoreClass
 * Checks if the entity has the required fields for the 'classes.core' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the CoreClass type
 */
export function isCoreClass(entity: SURefEntity): entity is SURefCoreClass {
  if (!entity || typeof entity !== 'object') return false
  if (!('maxAbilities' in entity)) return false
  if (!('advanceable' in entity)) return false
  if (!('coreTrees' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a HybridClass
 * Checks if the entity has the required fields for the 'classes.hybrid' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the HybridClass type
 */
export function isHybridClass(entity: SURefEntity): entity is SURefHybridClass {
  if (!entity || typeof entity !== 'object') return false
  if (!('advancedTree' in entity)) return false
  if (!('legendaryTree' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a CrawlerBay
 * Checks if the entity has the required fields for the 'crawler-bays' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the CrawlerBay type
 */
export function isCrawlerBay(entity: SURefEntity): entity is SURefCrawlerBay {
  if (!entity || typeof entity !== 'object') return false
  if (!('damagedEffect' in entity)) return false
  if (!('npc' in entity)) return false
  if (!('actions' in entity)) return false
  if (!('techLevelEffects' in entity)) return false
  return true
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
  if (!entity || typeof entity !== 'object') return false
  if (!('techLevel' in entity)) return false
  if (!('structurePoints' in entity)) return false
  if (!('populationMin' in entity)) return false
  if (!('populationMax' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Crawler
 * Checks if the entity has the required fields for the 'crawlers' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Crawler type
 */
export function isCrawler(entity: SURefEntity): entity is SURefCrawler {
  if (!entity || typeof entity !== 'object') return false
  if (!('npc' in entity)) return false
  if (!('actions' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Creature
 * Checks if the entity has the required fields for the 'creatures' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Creature type
 */
export function isCreature(entity: SURefEntity): entity is SURefCreature {
  if (!entity || typeof entity !== 'object') return false
  if (!('hitPoints' in entity)) return false
  if (!('actions' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Drone
 * Checks if the entity has the required fields for the 'drones' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Drone type
 */
export function isDrone(entity: SURefEntity): entity is SURefDrone {
  if (!entity || typeof entity !== 'object') return false
  if (!('structurePoints' in entity)) return false
  if (!('techLevel' in entity)) return false
  if (!('salvageValue' in entity)) return false
  if (!('systems' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Equipment
 * Checks if the entity has the required fields for the 'equipment' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Equipment type
 */
export function isEquipment(entity: SURefEntity): entity is SURefEquipment {
  if (!entity || typeof entity !== 'object') return false
  if (!('techLevel' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Keyword
 * Checks if the entity has the required fields for the 'keywords' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Keyword type
 */
export function isKeyword(entity: SURefEntity): entity is SURefKeyword {
  if (!entity || typeof entity !== 'object') return false
  // No required fields to check
  return true
}

/**
 * Type guard to check if an entity is a Meld
 * Checks if the entity has the required fields for the 'meld' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Meld type
 */
export function isMeld(entity: SURefEntity): entity is SURefMeld {
  if (!entity || typeof entity !== 'object') return false
  if (!('actions' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Module
 * Checks if the entity has the required fields for the 'modules' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Module type
 */
export function isModule(entity: SURefEntity): entity is SURefModule {
  if (!entity || typeof entity !== 'object') return false
  if (!('actions' in entity)) return false
  if (!('salvageValue' in entity)) return false
  if (!('slotsRequired' in entity)) return false
  if (!('techLevel' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a NPC
 * Checks if the entity has the required fields for the 'npcs' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the NPC type
 */
export function isNPC(entity: SURefEntity): entity is SURefNPC {
  if (!entity || typeof entity !== 'object') return false
  if (!('hitPoints' in entity)) return false
  if (!('actions' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a RollTable
 * Checks if the entity has the required fields for the 'roll-tables' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the RollTable type
 */
export function isRollTable(entity: SURefEntity): entity is SURefRollTable {
  if (!entity || typeof entity !== 'object') return false
  if (!('section' in entity)) return false
  if (!('table' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Squad
 * Checks if the entity has the required fields for the 'squads' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Squad type
 */
export function isSquad(entity: SURefEntity): entity is SURefSquad {
  if (!entity || typeof entity !== 'object') return false
  if (!('actions' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a System
 * Checks if the entity has the required fields for the 'systems' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the System type
 */
export function isSystem(entity: SURefEntity): entity is SURefSystem {
  if (!entity || typeof entity !== 'object') return false
  if (!('actions' in entity)) return false
  if (!('salvageValue' in entity)) return false
  if (!('slotsRequired' in entity)) return false
  if (!('techLevel' in entity)) return false
  return true
}

/**
 * Type guard to check if an entity is a Trait
 * Checks if the entity has the required fields for the 'traits' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Trait type
 */
export function isTrait(entity: SURefEntity): entity is SURefTrait {
  if (!entity || typeof entity !== 'object') return false
  // No required fields to check
  return true
}

/**
 * Type guard to check if an entity is a Vehicle
 * Checks if the entity has the required fields for the 'vehicles' schema
 * @param entity - The entity to check
 * @returns True if the entity matches the Vehicle type
 */
export function isVehicle(entity: SURefEntity): entity is SURefVehicle {
  if (!entity || typeof entity !== 'object') return false
  if (!('structurePoints' in entity)) return false
  if (!('techLevel' in entity)) return false
  if (!('salvageValue' in entity)) return false
  if (!('systems' in entity)) return false
  return true
}

// ============================================================================
// PROPERTY EXTRACTORS
// ============================================================================

/**
 * Extract structurePoints from an entity if it exists
 * Supported schemas: bio-titans, crawler-tech-levels, drones, vehicles
 * @param entity - The entity to extract from
 * @returns The structurePoints value or undefined
 */
export function getStructurePoints(entity: SURefEntity): unknown | undefined {
  return 'structurePoints' in entity
    ? (entity as unknown as Record<string, unknown>).structurePoints
    : undefined
}

/**
 * Extract actions from an entity if it exists
 * Supported schemas: bio-titans, chassis, crawler-bays, crawlers, creatures, equipment, meld, npcs, squads
 * @param entity - The entity to extract from
 * @returns The actions value or undefined
 */
export function getActions(entity: SURefEntity): unknown | undefined {
  return 'actions' in entity
    ? (entity as unknown as Record<string, unknown>).actions
    : undefined
}

/**
 * Extract traits from an entity if it exists
 * Supported schemas: bio-titans, creatures, equipment, meld, npcs, squads, vehicles
 * @param entity - The entity to extract from
 * @returns The traits value or undefined
 */
export function getTraits(entity: SURefEntity): unknown | undefined {
  return 'traits' in entity
    ? (entity as unknown as Record<string, unknown>).traits
    : undefined
}

/**
 * Extract npc from an entity if it exists
 * Supported schemas: chassis, crawler-bays, crawlers
 * @param entity - The entity to extract from
 * @returns The npc value or undefined
 */
export function getNpc(entity: SURefEntity): unknown | undefined {
  return 'npc' in entity
    ? (entity as unknown as Record<string, unknown>).npc
    : undefined
}

/**
 * Extract advancedTree from an entity if it exists
 * Supported schemas: classes.advanced, classes.hybrid
 * @param entity - The entity to extract from
 * @returns The advancedTree value or undefined
 */
export function getAdvancedTree(entity: SURefEntity): unknown | undefined {
  return 'advancedTree' in entity
    ? (entity as unknown as Record<string, unknown>).advancedTree
    : undefined
}

/**
 * Extract legendaryTree from an entity if it exists
 * Supported schemas: classes.advanced, classes.hybrid
 * @param entity - The entity to extract from
 * @returns The legendaryTree value or undefined
 */
export function getLegendaryTree(entity: SURefEntity): unknown | undefined {
  return 'legendaryTree' in entity
    ? (entity as unknown as Record<string, unknown>).legendaryTree
    : undefined
}

/**
 * Extract techLevel from an entity if it exists
 * Supported schemas: crawler-tech-levels, drones, equipment, vehicles
 * @param entity - The entity to extract from
 * @returns The techLevel value or undefined
 */
export function getTechLevel(entity: SURefEntity): number | undefined {
  return 'techLevel' in entity
    ? (entity as unknown as Record<string, number>).techLevel
    : undefined
}

/**
 * Extract hitPoints from an entity if it exists
 * Supported schemas: creatures, npcs, squads
 * @param entity - The entity to extract from
 * @returns The hitPoints value or undefined
 */
export function getHitPoints(entity: SURefEntity): unknown | undefined {
  return 'hitPoints' in entity
    ? (entity as unknown as Record<string, unknown>).hitPoints
    : undefined
}

/**
 * Extract salvageValue from an entity if it exists
 * Supported schemas: drones, vehicles
 * @param entity - The entity to extract from
 * @returns The salvageValue value or undefined
 */
export function getSalvageValue(entity: SURefEntity): unknown | undefined {
  return 'salvageValue' in entity
    ? (entity as unknown as Record<string, unknown>).salvageValue
    : undefined
}

/**
 * Extract systems from an entity if it exists
 * Supported schemas: drones, vehicles
 * @param entity - The entity to extract from
 * @returns The systems value or undefined
 */
export function getSystems(entity: SURefEntity): unknown | undefined {
  return 'systems' in entity
    ? (entity as unknown as Record<string, unknown>).systems
    : undefined
}

/**
 * Extract page reference from an entity
 * All entities have a page reference from the entry definition
 * @param entity - The entity to extract from
 * @returns The page number or undefined
 */
export function getPageReference(entity: SURefEntity): number | undefined {
  return 'page' in entity
    ? (entity as unknown as Record<string, number>).page
    : undefined
}
