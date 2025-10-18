import { BaseModel } from "../BaseModel.js";
import { Chassis, SalvageUnionMechChassis } from "../types/inferred.js";
import chassisData from "../../data/chassis.json" with { type: "json" };
import chassisSchema from "../../schemas/chassis.schema.json" with { type: "json" };

export class ChassisModel extends BaseModel<Chassis> {
  constructor() {
    super(chassisData as Chassis[], chassisSchema);
  }

  findByTechLevel(level: number): Chassis[] {
    return this.where((c) => c.stats?.tech_level === level);
  }

  findBySalvageValue(value: number): Chassis[] {
    return this.where((c) => c.stats?.salvage_value === value);
  }

  findByMinStructurePoints(min: number): Chassis[] {
    return this.where((c) => (c.stats?.structure_pts ?? 0) >= min);
  }

  findByMinSystemSlots(min: number): Chassis[] {
    return this.where((c) => (c.stats?.system_slots ?? 0) >= min);
  }

  findByMinModuleSlots(min: number): Chassis[] {
    return this.where((c) => (c.stats?.module_slots ?? 0) >= min);
  }

  findByMinCargoCap(min: number): Chassis[] {
    return this.where((c) => (c.stats?.cargo_cap ?? 0) >= min);
  }
}
