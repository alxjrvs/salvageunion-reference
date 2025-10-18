import { BaseModel } from "../BaseModel.js";
import { Vehicle, SalvageUnionVehicles } from "../types/inferred.js";
import vehiclesData from "../../data/vehicles.json" with { type: "json" };
import vehiclesSchema from "../../schemas/vehicles.schema.json" with { type: "json" };


export class VehiclesModel extends BaseModel<Vehicle> {
  constructor() {
    super(vehiclesData as Vehicle[], vehiclesSchema);
  }

  findByTechLevel(level: number): Vehicle[] {
    return this.where((v) => v.techLevel === level);
  }

  findBySalvageValue(value: number): Vehicle[] {
    return this.where((v) => v.salvageValue === value);
  }

  findByMinStructurePoints(min: number): Vehicle[] {
    return this.where((v) => (v.structurePoints ?? 0) >= min);
  }
}
