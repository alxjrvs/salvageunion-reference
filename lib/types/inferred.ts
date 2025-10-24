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
import crawlerBaysData from '../../data/crawler-bays.json' with { type: 'json' }
import crawlerTechLevelsData from '../../data/crawler-tech-levels.json' with { type: 'json' }
import creaturesData from '../../data/creatures.json' with { type: 'json' }
import dronesData from '../../data/drones.json' with { type: 'json' }
import equipmentData from '../../data/equipment.json' with { type: 'json' }
import keywordsData from '../../data/keywords.json' with { type: 'json' }
import meldData from '../../data/meld.json' with { type: 'json' }
import modulesData from '../../data/modules.json' with { type: 'json' }
import npcsData from '../../data/npcs.json' with { type: 'json' }
import squadsData from '../../data/squads.json' with { type: 'json' }
import systemsData from '../../data/systems.json' with { type: 'json' }
import rollTablesData from '../../data/roll-tables.json' with { type: 'json' }
import traitsData from '../../data/traits.json' with { type: 'json' }
import vehiclesData from '../../data/vehicles.json' with { type: 'json' }

// Infer array types from the imported data
export type SURefAbilityList = typeof abilitiesData
export type SURefAbilityTreeRequirementList = typeof abilityTreeRequirementsData
export type SURefBioTitanList = typeof bioTitansData
export type SURefMechChassisList = typeof chassisData
export type SURefClassList = typeof classesData
export type SURefCrawlerList = typeof crawlersData
export type SURefCrawlerBayList = typeof crawlerBaysData
export type SURefCrawlerTechLevelList = typeof crawlerTechLevelsData
export type SURefCreatureList = typeof creaturesData
export type SURefDroneList = typeof dronesData
export type SURefEquipmentList = typeof equipmentData
export type SURefKeywordList = typeof keywordsData
export type SURefMeldList = typeof meldData
export type SURefModuleList = typeof modulesData
export type SURefNPCList = typeof npcsData
export type SURefSquadList = typeof squadsData
export type SURefSystemList = typeof systemsData
export type SURefRollTableList = typeof rollTablesData
export type SURefTraitList = typeof traitsData
export type SURefVehicleList = typeof vehiclesData

// Extract individual item types from arrays
export type SURefAbility = SURefAbilityList[number]
export type SURefAbilityTreeRequirement =
  SURefAbilityTreeRequirementList[number]
export type SURefBioTitan = SURefBioTitanList[number]
export type SURefChassis = SURefMechChassisList[number]
export type SURefClass = SURefClassList[number]
export type SURefCrawler = SURefCrawlerList[number]
export type SURefCrawlerBay = SURefCrawlerBayList[number]
export type SURefCrawlerTechLevel = SURefCrawlerTechLevelList[number]
export type SURefCreature = SURefCreatureList[number]
export type SURefDrone = SURefDroneList[number]
export type SURefEquipment = SURefEquipmentList[number]
export type SURefKeyword = SURefKeywordList[number]
export type SURefMeld = SURefMeldList[number]
export type SURefModule = SURefModuleList[number]
export type SURefNPC = SURefNPCList[number]
export type SURefSquad = SURefSquadList[number]
export type SURefSystem = SURefSystemList[number]
export type SURefRollTable = SURefRollTableList[number]
export type SURefTraitEntry = SURefTraitList[number]
export type SURefVehicle = SURefVehicleList[number]

// Shared trait type (inferred from actual usage in data)
// This type appears in abilities, equipment, modules, systems, etc.
export type Traits = NonNullable<
  | SURefAbility['traits']
  | SURefEquipment['traits']
  | SURefModule['traits']
  | SURefSystem['traits']
>

// Backward compatibility aliases (old naming convention)
export type SalvageUnionAbilities = SURefAbilityList
export type SalvageUnionAbilityTreeRequirements =
  SURefAbilityTreeRequirementList
export type SalvageUnionBioTitans = SURefBioTitanList
export type SalvageUnionMechChassis = SURefMechChassisList
export type SalvageUnionClasses = SURefClassList
export type SalvageUnionCrawlers = SURefCrawlerList
export type SalvageUnionCrawlerBays = SURefCrawlerBayList
export type SalvageUnionCrawlerTechLevels = SURefCrawlerTechLevelList
export type SalvageUnionCreatures = SURefCreatureList
export type SalvageUnionDrones = SURefDroneList
export type SalvageUnionEquipment = SURefEquipmentList
export type SalvageUnionKeywords = SURefKeywordList
export type SalvageUnionMeld = SURefMeldList
export type SalvageUnionModules = SURefModuleList
export type SalvageUnionNPCs = SURefNPCList
export type SalvageUnionSquads = SURefSquadList
export type SalvageUnionSystems = SURefSystemList
export type SalvageUnionRollTables = SURefRollTableList
export type SalvageUnionTraits = SURefTraitList
export type SalvageUnionVehicles = SURefVehicleList

export type Ability = SURefAbility
export type AbilityTreeRequirement = SURefAbilityTreeRequirement
export type BioTitan = SURefBioTitan
export type Chassis = SURefChassis
export type Class = SURefClass
export type Crawler = SURefCrawler
export type CrawlerBay = SURefCrawlerBay
export type CrawlerTechLevel = SURefCrawlerTechLevel
export type Creature = SURefCreature
export type Drone = SURefDrone
export type Equipment = SURefEquipment
export type Keyword = SURefKeyword
export type Meld = SURefMeld
export type Module = SURefModule
export type NPC = SURefNPC
export type Squad = SURefSquad
export type System = SURefSystem
export type RollTable = SURefRollTable
export type TraitEntry = SURefTraitEntry
export type Vehicle = SURefVehicle
