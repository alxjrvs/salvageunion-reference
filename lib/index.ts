/**
 * Salvage Union Data ORM
 *
 * Type-safe query interface for Salvage Union game data
 */

// Import models first
import { AbilitiesModel } from "./models/Abilities.js";
import { AbilityTreeRequirementsModel } from "./models/AbilityTreeRequirements.js";
import { BioTitansModel } from "./models/BioTitans.js";
import { ChassisModel } from "./models/Chassis.js";
import { ClassesModel } from "./models/Classes.js";
import { CrawlersModel } from "./models/Crawlers.js";
import { CreaturesModel } from "./models/Creatures.js";
import { DronesModel } from "./models/Drones.js";
import { EquipmentModel } from "./models/Equipment.js";
import { KeywordsModel } from "./models/Keywords.js";
import { MeldModel } from "./models/Meld.js";
import { ModulesModel } from "./models/Modules.js";
import { NPCsModel } from "./models/NPCs.js";
import { SquadsModel } from "./models/Squads.js";
import { SystemsModel } from "./models/Systems.js";
import { TablesModel } from "./models/Tables.js";
import { TraitsModel } from "./models/Traits.js";
import { VehiclesModel } from "./models/Vehicles.js";

// Export model classes
export { AbilitiesModel } from "./models/Abilities.js";
export { AbilityTreeRequirementsModel } from "./models/AbilityTreeRequirements.js";
export { BioTitansModel } from "./models/BioTitans.js";
export { ChassisModel } from "./models/Chassis.js";
export { ClassesModel } from "./models/Classes.js";
export { CrawlersModel } from "./models/Crawlers.js";
export { CreaturesModel } from "./models/Creatures.js";
export { DronesModel } from "./models/Drones.js";
export { EquipmentModel } from "./models/Equipment.js";
export { KeywordsModel } from "./models/Keywords.js";
export { MeldModel } from "./models/Meld.js";
export { ModulesModel } from "./models/Modules.js";
export { NPCsModel } from "./models/NPCs.js";
export { SquadsModel } from "./models/Squads.js";
export { SystemsModel } from "./models/Systems.js";
export { TablesModel } from "./models/Tables.js";
export { TraitsModel } from "./models/Traits.js";
export { VehiclesModel } from "./models/Vehicles.js";

// Export base model for custom extensions
export { BaseModel } from "./BaseModel.js";

// Export types
export type { SalvageUnionAbilities } from "./types/abilities.js";
export type { SalvageUnionAbilityTreeRequirements } from "./types/ability-tree-requirements.js";
export type { SalvageUnionBioTitans } from "./types/bio-titans.js";
export type { SalvageUnionMechChassis } from "./types/chassis.js";
export type { SalvageUnionClasses } from "./types/classes.js";
export type { SalvageUnionCrawlers } from "./types/crawlers.js";
export type { SalvageUnionCreatures } from "./types/creatures.js";
export type { SalvageUnionDrones } from "./types/drones.js";
export type { SalvageUnionEquipment } from "./types/equipment.js";
export type { SalvageUnionKeywords } from "./types/keywords.js";
export type { SalvageUnionMeld } from "./types/meld.js";
export type { SalvageUnionModules } from "./types/modules.js";
export type { SalvageUnionNPCs } from "./types/npcs.js";
export type { SalvageUnionSquads } from "./types/squads.js";
export type { SalvageUnionSystems } from "./types/systems.js";
export type { SalvageUnionTables } from "./types/tables.js";
export type { SalvageUnionTraits } from "./types/traits.js";
export type { SalvageUnionVehicles } from "./types/vehicles.js";

export class SalvageUnionData {
  public static Abilities = new AbilitiesModel();
  public static AbilityTreeRequirements = new AbilityTreeRequirementsModel();
  public static BioTitans = new BioTitansModel();
  public static Chassis = new ChassisModel();
  public static Classes = new ClassesModel();
  public static Crawlers = new CrawlersModel();
  public static Creatures = new CreaturesModel();
  public static Drones = new DronesModel();
  public static Equipment = new EquipmentModel();
  public static Keywords = new KeywordsModel();
  public static Meld = new MeldModel();
  public static Modules = new ModulesModel();
  public static NPCs = new NPCsModel();
  public static Squads = new SquadsModel();
  public static Systems = new SystemsModel();
  public static Tables = new TablesModel();
  public static Traits = new TraitsModel();
  public static Vehicles = new VehiclesModel();
}
