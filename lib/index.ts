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
  SURefCoreClass,
  SURefHybridClass,
  SURefAdvancedClass,
  SURefCrawler,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefCreature,
  SURefDrone,
  SURefEquipment,
  SURefKeyword,
  SURefMeld,
  SURefModule,
  SURefNPC,
  SURefSquad,
  SURefSystem,
  SURefRollTable,
  SURefTrait,
  SURefVehicle,
} from './types/inferred.js'

// Export base model for custom extensions
export { BaseModel } from './BaseModel.js'

export { resultForTable, type TableRollResult } from './utils/resultForTable.js'

// Export inferred types (auto-generated from JSON data)
export type {
  // Singles
  SURefAbility,
  SURefAbilityTreeRequirement,
  SURefBioTitan,
  SURefChassis,
  SURefClass,
  SURefAdvancedClass,
  SURefCoreClass,
  SURefHybridClass,
  SURefCrawler,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefCreature,
  SURefDrone,
  SURefEquipment,
  SURefKeyword,
  SURefMeld,
  SURefModule,
  SURefNPC,
  SURefSquad,
  SURefSystem,
  SURefRollTable,
  SURefTrait,
  SURefVehicle,
  // Meta
  SURefTraitMetaList,
  SURefActionMetaList,
  SURefMetaTable,
  SURefEntity,
  SURefEntityName,
  // Lists
  SURefAbilityList,
  SURefAbilityTreeRequirementList,
  SURefBioTitanList,
  SURefMechChassisList,
  SURefAdvancedClassList,
  SURefCoreClassList,
  SURefHybridClassList,
  SURefClassList,
  SURefCrawlerList,
  SURefCrawlerBayList,
  SURefCrawlerTechLevelList,
  SURefCreatureList,
  SURefDroneList,
  SURefEquipmentList,
  SURefKeywordList,
  SURefMeldList,
  SURefModuleList,
  SURefNPCList,
  SURefSquadList,
  SURefSystemList,
  SURefRollTableList,
  SURefTraitList,
  SURefVehicleList,
} from './types/inferred.js'

/**
 * Type-safe helper for handling optional query results
 * Use this to safely work with results from find/findById/findByName
 *
 * @example
 * const table = SalvageUnionReference.RollTables.findByName('Core Mechanic');
 * if (table) {
 *   // table is now safely typed as RollTable
 *   console.log(table.name);
 * }
 */
export type Optional<T> = T | undefined

// Auto-generate models from schema catalog
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
  public static readonly Crawlers = models.Crawlers as BaseModel<SURefCrawler>
  public static readonly CrawlerBays =
    models.CrawlerBays as BaseModel<SURefCrawlerBay>
  public static readonly CrawlerTechLevels =
    models.CrawlerTechLevels as BaseModel<SURefCrawlerTechLevel>
  public static readonly Creatures =
    models.Creatures as BaseModel<SURefCreature>
  public static readonly Drones = models.Drones as BaseModel<SURefDrone>
  public static readonly Equipment =
    models.Equipment as BaseModel<SURefEquipment>
  public static readonly Keywords = models.Keywords as BaseModel<SURefKeyword>
  public static readonly Meld = models.Meld as BaseModel<SURefMeld>
  public static readonly Modules = models.Modules as BaseModel<SURefModule>
  public static readonly NPCs = models.NPCs as BaseModel<SURefNPC>
  public static readonly Squads = models.Squads as BaseModel<SURefSquad>
  public static readonly Systems = models.Systems as BaseModel<SURefSystem>
  public static readonly RollTables =
    models.RollTables as BaseModel<SURefRollTable>
  public static readonly Traits = models.Traits as BaseModel<SURefTrait>
  public static readonly Vehicles = models.Vehicles as BaseModel<SURefVehicle>
}
