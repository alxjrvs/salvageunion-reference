import { BaseModel } from '../BaseModel.js'
import type { SURefCreature } from '../types/inferred.js'
import creaturesData from '../../data/creatures.json' with { type: 'json' }
import creaturesSchema from '../../schemas/creatures.schema.json' with { type: 'json' }

export class CreaturesModel extends BaseModel<SURefCreature> {
  constructor() {
    super(creaturesData as SURefCreature[], creaturesSchema)
  }

  findByHitPoints(hp: number): SURefCreature[] {
    return this.where((c) => c.hitPoints === hp)
  }

  findByMinHitPoints(min: number): SURefCreature[] {
    return this.where((c) => (c.hitPoints ?? 0) >= min)
  }
}
