import { BaseModel } from '../BaseModel.js'
import { SURefVehicle } from '../types/inferred.js'
import vehiclesData from '../../data/vehicles.json' with { type: 'json' }
import vehiclesSchema from '../../schemas/vehicles.schema.json' with { type: 'json' }

export class VehiclesModel extends BaseModel<SURefVehicle> {
  constructor() {
    super(vehiclesData as SURefVehicle[], vehiclesSchema)
  }

  findByTechLevel(level: number): SURefVehicle[] {
    return this.where((v) => v.techLevel === level)
  }

  findBySalvageValue(value: number): SURefVehicle[] {
    return this.where((v) => v.salvageValue === value)
  }

  findByMinStructurePoints(min: number): SURefVehicle[] {
    return this.where((v) => (v.structurePoints ?? 0) >= min)
  }
}
