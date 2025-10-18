import { BaseModel } from "../BaseModel.js";
import { Drone, SalvageUnionDrones } from "../types/inferred.js";
import dronesData from "../../data/drones.json" with { type: "json" };
import dronesSchema from "../../schemas/drones.schema.json" with { type: "json" };

export class DronesModel extends BaseModel<Drone> {
  constructor() {
    super(dronesData as Drone[], dronesSchema);
  }

  findByTechLevel(level: number): Drone[] {
    return this.where((d) => d.techLevel === level);
  }

  findBySalvageValue(value: number): Drone[] {
    return this.where((d) => d.salvageValue === value);
  }

  findByMinStructurePoints(min: number): Drone[] {
    return this.where((d) => (d.structurePoints ?? 0) >= min);
  }
}
