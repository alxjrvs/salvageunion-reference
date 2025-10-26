import abilitiesData from '../../data/abilities.json' with { type: 'json' }
import ability_tree_requirementsData from '../../data/ability-tree-requirements.json' with { type: 'json' }
import bio_titansData from '../../data/bio-titans.json' with { type: 'json' }
import chassisData from '../../data/chassis.json' with { type: 'json' }
import classes_advancedData from '../../data/classes.advanced.json' with { type: 'json' }
import classes_coreData from '../../data/classes.core.json' with { type: 'json' }
import classes_hybridData from '../../data/classes.hybrid.json' with { type: 'json' }
import crawler_baysData from '../../data/crawler-bays.json' with { type: 'json' }
import crawler_tech_levelsData from '../../data/crawler-tech-levels.json' with { type: 'json' }
import crawlersData from '../../data/crawlers.json' with { type: 'json' }
import creaturesData from '../../data/creatures.json' with { type: 'json' }
import dronesData from '../../data/drones.json' with { type: 'json' }
import equipmentData from '../../data/equipment.json' with { type: 'json' }
import keywordsData from '../../data/keywords.json' with { type: 'json' }
import meldData from '../../data/meld.json' with { type: 'json' }
import modulesData from '../../data/modules.json' with { type: 'json' }
import npcsData from '../../data/npcs.json' with { type: 'json' }
import roll_tablesData from '../../data/roll-tables.json' with { type: 'json' }
import squadsData from '../../data/squads.json' with { type: 'json' }
import systemsData from '../../data/systems.json' with { type: 'json' }
import traitsData from '../../data/traits.json' with { type: 'json' }
import vehiclesData from '../../data/vehicles.json' with { type: 'json' }

// List types (arrays)
export type SURefAbilityList = typeof abilitiesData
export type SURefAbilityTreeRequirementList =
  typeof ability_tree_requirementsData
export type SURefBioTitanList = typeof bio_titansData
export type SURefChassisList = typeof chassisData
export type SURefAdvancedClassList = typeof classes_advancedData
export type SURefCoreClassList = typeof classes_coreData
export type SURefHybridClassList = typeof classes_hybridData
export type SURefCrawlerBayList = typeof crawler_baysData
export type SURefCrawlerTechLevelList = typeof crawler_tech_levelsData
export type SURefCrawlerList = typeof crawlersData
export type SURefCreatureList = typeof creaturesData
export type SURefDroneList = typeof dronesData
export type SURefEquipmentList = typeof equipmentData
export type SURefKeywordList = typeof keywordsData
export type SURefMeldList = typeof meldData
export type SURefModuleList = typeof modulesData
export type SURefNPCList = typeof npcsData
export type SURefRollTableList = typeof roll_tablesData
export type SURefSquadList = typeof squadsData
export type SURefSystemList = typeof systemsData
export type SURefTraitList = typeof traitsData
export type SURefVehicleList = typeof vehiclesData

// Single item types
export type SURefAbility = SURefAbilityList[number]
export type SURefAbilityTreeRequirement =
  SURefAbilityTreeRequirementList[number]
export type SURefBioTitan = SURefBioTitanList[number]
export type SURefChassis = SURefChassisList[number]
export type SURefAdvancedClass = SURefAdvancedClassList[number]
export type SURefCoreClass = SURefCoreClassList[number]
export type SURefHybridClass = SURefHybridClassList[number]
export type SURefCrawlerBay = SURefCrawlerBayList[number]
export type SURefCrawlerTechLevel = SURefCrawlerTechLevelList[number]
export type SURefCrawler = SURefCrawlerList[number]
export type SURefCreature = SURefCreatureList[number]
export type SURefDrone = SURefDroneList[number]
export type SURefEquipment = SURefEquipmentList[number]
export type SURefKeyword = SURefKeywordList[number]
export type SURefMeld = SURefMeldList[number]
export type SURefModule = SURefModuleList[number]
export type SURefNPC = SURefNPCList[number]
export type SURefRollTable = SURefRollTableList[number]
export type SURefSquad = SURefSquadList[number]
export type SURefSystem = SURefSystemList[number]
export type SURefTrait = SURefTraitList[number]
export type SURefVehicle = SURefVehicleList[number]

// Union type for all classes
export type SURefClass = SURefAdvancedClass | SURefCoreClass | SURefHybridClass
export type SURefClassList = Array<SURefClass>

// Shared trait type (inferred from actual usage in data)
export type SURefTraitMetaList = NonNullable<
  | SURefAbility['traits']
  | SURefEquipment['traits']
  | SURefModule['traits']
  | SURefSystem['traits']
>

export type SURefActionMetaList = NonNullable<
  | NonNullable<SURefAbility['subAbilities']>[number]
  | NonNullable<SURefSystem['actions']>[number]
  | NonNullable<SURefModule['actions']>[number]
  | NonNullable<SURefEquipment['actions']>[number]
  | SURefBioTitan['abilities'][number]
  | SURefNPC['abilities'][number]
  | NonNullable<SURefMeld['abilities']>[number]
  | NonNullable<SURefSquad['abilities']>[number]
  | SURefCreature['abilities'][number]
>

export type SURefMetaTable =
  | SURefRollTable['table']
  | SURefSystem['table']
  | SURefEquipment['table']
  | SURefCrawlerBay['table']
  | SURefAbility['table']

export type SURefEntity =
  | SURefVehicle
  | SURefCreature
  | SURefDrone
  | SURefBioTitan
  | SURefNPC
  | SURefSquad
  | SURefMeld
  | SURefKeyword
  | SURefTrait
  | SURefSystem
  | SURefModule
  | SURefEquipment
  | SURefAbility
  | SURefAbilityTreeRequirement
  | SURefRollTable
  | SURefCrawler
  | SURefCrawlerTechLevel
  | SURefClass
  | SURefCrawlerBay
  | SURefChassis

export type SURefEntityName =
  | 'Vehicle'
  | 'Creature'
  | 'Drone'
  | 'BioTitan'
  | 'NPC'
  | 'Squad'
  | 'Meld'
  | 'Keyword'
  | 'Trait'
  | 'System'
  | 'Module'
  | 'Equipment'
  | 'Ability'
  | 'AbilityTreeRequirement'
  | 'RollTable'
  | 'Crawler'
  | 'CrawlerTechLevel'
  | 'Class'
  | 'CrawlerBay'
  | 'Chassis'
