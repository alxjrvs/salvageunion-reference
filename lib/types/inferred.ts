/**
 * Auto-inferred types from JSON data files
 * These types are derived directly from the data, ensuring perfect sync
 *
 * This file replaces the need for json-schema-to-typescript generation.
 * Types are inferred from actual data using TypeScript's `typeof` operator.
 */

import abilitiesData from '../../data/abilities.json' with { type: 'json' }
import abilityTreeRequirementsData from '../../data/ability-tree-requirements.json' with { type: 'json' }
import bioTitansData from '../../data/bio-titans.json' with { type: 'json' }
import chassisData from '../../data/chassis.json' with { type: 'json' }
import classesData from '../../data/classes.json' with { type: 'json' }
import crawlersData from '../../data/crawlers.json' with { type: 'json' }
import creaturesData from '../../data/creatures.json' with { type: 'json' }
import dronesData from '../../data/drones.json' with { type: 'json' }
import equipmentData from '../../data/equipment.json' with { type: 'json' }
import keywordsData from '../../data/keywords.json' with { type: 'json' }
import meldData from '../../data/meld.json' with { type: 'json' }
import modulesData from '../../data/modules.json' with { type: 'json' }
import npcsData from '../../data/npcs.json' with { type: 'json' }
import squadsData from '../../data/squads.json' with { type: 'json' }
import systemsData from '../../data/systems.json' with { type: 'json' }
import tablesData from '../../data/tables.json' with { type: 'json' }
import traitsData from '../../data/traits.json' with { type: 'json' }
import vehiclesData from '../../data/vehicles.json' with { type: 'json' }

// Infer array types from the imported data
export type SalvageUnionAbilities = typeof abilitiesData
export type SalvageUnionAbilityTreeRequirements =
  typeof abilityTreeRequirementsData
export type SalvageUnionBioTitans = typeof bioTitansData
export type SalvageUnionMechChassis = typeof chassisData
export type SalvageUnionClasses = typeof classesData
export type SalvageUnionCrawlers = typeof crawlersData
export type SalvageUnionCreatures = typeof creaturesData
export type SalvageUnionDrones = typeof dronesData
export type SalvageUnionEquipment = typeof equipmentData
export type SalvageUnionKeywords = typeof keywordsData
export type SalvageUnionMeld = typeof meldData
export type SalvageUnionModules = typeof modulesData
export type SalvageUnionNPCs = typeof npcsData
export type SalvageUnionSquads = typeof squadsData
export type SalvageUnionSystems = typeof systemsData
export type SalvageUnionTables = typeof tablesData
export type SalvageUnionTraits = typeof traitsData
export type SalvageUnionVehicles = typeof vehiclesData

// Extract individual item types from arrays
export type Ability = SalvageUnionAbilities[number]
export type AbilityTreeRequirement = SalvageUnionAbilityTreeRequirements[number]
export type BioTitan = SalvageUnionBioTitans[number]
export type Chassis = SalvageUnionMechChassis[number]
export type Class = SalvageUnionClasses[number]
export type Crawler = SalvageUnionCrawlers[number]
export type Creature = SalvageUnionCreatures[number]
export type Drone = SalvageUnionDrones[number]
export type Equipment = SalvageUnionEquipment[number]
export type Keyword = SalvageUnionKeywords[number]
export type Meld = SalvageUnionMeld[number]
export type Module = SalvageUnionModules[number]
export type NPC = SalvageUnionNPCs[number]
export type Squad = SalvageUnionSquads[number]
export type System = SalvageUnionSystems[number]
export type Table = SalvageUnionTables[number]
export type TraitEntry = SalvageUnionTraits[number]
export type Vehicle = SalvageUnionVehicles[number]

// Shared trait type (inferred from actual usage in data)
// This type appears in abilities, equipment, modules, systems, etc.
export type Traits = NonNullable<
  Ability['traits'] | Equipment['traits'] | Module['traits'] | System['traits']
>
