/**
 * Salvage Union Data ORM
 *
 * Type-safe query interface for Salvage Union game data
 */

// Import models first
import { AbilitiesModel } from './models/Abilities.js'
import { AbilityTreeRequirementsModel } from './models/AbilityTreeRequirements.js'
import { BioTitansModel } from './models/BioTitans.js'
import { ChassisModel } from './models/Chassis.js'
import { ClassesModel } from './models/Classes.js'
import { CrawlersModel } from './models/Crawlers.js'
import { CrawlerBaysModel } from './models/CrawlerBays.js'
import { CrawlerTechLevelsModel } from './models/CrawlerTechLevels.js'
import { CreaturesModel } from './models/Creatures.js'
import { DronesModel } from './models/Drones.js'
import { EquipmentModel } from './models/Equipment.js'
import { KeywordsModel } from './models/Keywords.js'
import { MeldModel } from './models/Meld.js'
import { ModulesModel } from './models/Modules.js'
import { NPCsModel } from './models/NPCs.js'
import { SquadsModel } from './models/Squads.js'
import { SystemsModel } from './models/Systems.js'
import { RollTablesModel } from './models/RollTables.js'
import { TraitsModel } from './models/Traits.js'
import { VehiclesModel } from './models/Vehicles.js'

// Export model classes
export { AbilitiesModel } from './models/Abilities.js'
export { AbilityTreeRequirementsModel } from './models/AbilityTreeRequirements.js'
export { BioTitansModel } from './models/BioTitans.js'
export { ChassisModel } from './models/Chassis.js'
export { ClassesModel } from './models/Classes.js'
export { CrawlersModel } from './models/Crawlers.js'
export { CrawlerBaysModel } from './models/CrawlerBays.js'
export { CrawlerTechLevelsModel } from './models/CrawlerTechLevels.js'
export { CreaturesModel } from './models/Creatures.js'
export { DronesModel } from './models/Drones.js'
export { EquipmentModel } from './models/Equipment.js'
export { KeywordsModel } from './models/Keywords.js'
export { MeldModel } from './models/Meld.js'
export { ModulesModel } from './models/Modules.js'
export { NPCsModel } from './models/NPCs.js'
export { SquadsModel } from './models/Squads.js'
export { SystemsModel } from './models/Systems.js'
export { RollTablesModel } from './models/RollTables.js'
export { TraitsModel } from './models/Traits.js'
export { VehiclesModel } from './models/Vehicles.js'

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
  SURefTraitEntry,
  SURefVehicle,
  // Meta
  SURefTraitMetaList,
  SUrRefActionMetaList,
  // Lists
  SURefAbilityList,
  SURefAbilityTreeRequirementList,
  SURefBioTitanList,
  SURefMechChassisList,
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

export class SalvageUnionReference {
  public static readonly Abilities: AbilitiesModel = new AbilitiesModel()
  public static readonly AbilityTreeRequirements: AbilityTreeRequirementsModel =
    new AbilityTreeRequirementsModel()
  public static readonly BioTitans: BioTitansModel = new BioTitansModel()
  public static readonly Chassis: ChassisModel = new ChassisModel()
  public static readonly Classes: ClassesModel = new ClassesModel()
  public static readonly Crawlers: CrawlersModel = new CrawlersModel()
  public static readonly CrawlerBays: CrawlerBaysModel = new CrawlerBaysModel()
  public static readonly CrawlerTechLevels: CrawlerTechLevelsModel =
    new CrawlerTechLevelsModel()
  public static readonly Creatures: CreaturesModel = new CreaturesModel()
  public static readonly Drones: DronesModel = new DronesModel()
  public static readonly Equipment: EquipmentModel = new EquipmentModel()
  public static readonly Keywords: KeywordsModel = new KeywordsModel()
  public static readonly Meld: MeldModel = new MeldModel()
  public static readonly Modules: ModulesModel = new ModulesModel()
  public static readonly NPCs: NPCsModel = new NPCsModel()
  public static readonly Squads: SquadsModel = new SquadsModel()
  public static readonly Systems: SystemsModel = new SystemsModel()
  public static readonly RollTables: RollTablesModel = new RollTablesModel()
  public static readonly Traits: TraitsModel = new TraitsModel()
  public static readonly Vehicles: VehiclesModel = new VehiclesModel()
}
