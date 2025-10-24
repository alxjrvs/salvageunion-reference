import { BaseModel } from '../BaseModel.js'
import type { SURefNPC } from '../types/inferred.js'
import npcsData from '../../data/npcs.json' with { type: 'json' }
import npcsSchema from '../../schemas/npcs.schema.json' with { type: 'json' }

export class NPCsModel extends BaseModel<SURefNPC> {
  constructor() {
    super(npcsData as SURefNPC[], npcsSchema)
  }

  findByHitPoints(hp: number): SURefNPC[] {
    return this.where((n) => n.hitPoints === hp)
  }

  findByMinHitPoints(min: number): SURefNPC[] {
    return this.where((n) => (n.hitPoints ?? 0) >= min)
  }
}
