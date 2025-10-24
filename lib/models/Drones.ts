import { BaseModel } from '../BaseModel.js'
import type { SURefDrone } from '../types/inferred.js'
import dronesData from '../../data/drones.json' with { type: 'json' }
import dronesSchema from '../../schemas/drones.schema.json' with { type: 'json' }

export class DronesModel extends BaseModel<SURefDrone> {
  constructor() {
    super(dronesData as SURefDrone[], dronesSchema)
  }

  findByTechLevel(level: number): SURefDrone[] {
    return this.where((d) => d.techLevel === level)
  }

  findBySalvageValue(value: number): SURefDrone[] {
    return this.where((d) => d.salvageValue === value)
  }

  findByMinStructurePoints(min: number): SURefDrone[] {
    return this.where((d) => (d.structurePoints ?? 0) >= min)
  }
}
