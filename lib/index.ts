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
} from './types/inferred.js'

export { BaseModel } from './BaseModel.js'

export { getDataMaps, getSchemaCatalog } from './ModelFactory.js'

export { resultForTable, type TableRollResult } from './utils/resultForTable.js'

export type * from './types/inferred.js'

// Auto-generate models from schema catalog (top-level await)
const models = await generateModels()

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
  public static readonly CrawlerBays =
    models.CrawlerBays as BaseModel<SURefCrawlerBay>
  public static readonly CrawlerTechLevels =
    models.CrawlerTechLevels as BaseModel<SURefCrawlerTechLevel>
  public static readonly Crawlers = models.Crawlers as BaseModel<SURefCrawler>
  public static readonly Creatures =
    models.Creatures as BaseModel<SURefCreature>
  public static readonly Drones = models.Drones as BaseModel<SURefDrone>
  public static readonly Equipment =
    models.Equipment as BaseModel<SURefEquipment>
  public static readonly Keywords = models.Keywords as BaseModel<SURefKeyword>
  public static readonly Meld = models.Meld as BaseModel<SURefMeld>
  public static readonly Modules = models.Modules as BaseModel<SURefModule>
  public static readonly NPCs = models.NPCs as BaseModel<SURefNPC>
  public static readonly RollTables =
    models.RollTables as BaseModel<SURefRollTable>
  public static readonly Squads = models.Squads as BaseModel<SURefSquad>
  public static readonly Systems = models.Systems as BaseModel<SURefSystem>
  public static readonly Traits = models.Traits as BaseModel<SURefTrait>
  public static readonly Vehicles = models.Vehicles as BaseModel<SURefVehicle>
}
