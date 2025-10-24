import squadsData from '../../data/squads.json' with { type: 'json' }
import squadsSchema from '../../schemas/squads.schema.json' with { type: 'json' }
import type { SURefSquad } from '../types/inferred.js'

export class SquadsModel {
  protected data: SURefSquad[]
  protected schema: Record<string, unknown>

  constructor() {
    this.data = squadsData as SURefSquad[]
    this.schema = squadsSchema as Record<string, unknown>
  }

  all(): SURefSquad[] {
    return this.data
  }

  count(): number {
    return this.data.length
  }

  find(predicate: (item: SURefSquad) => boolean): SURefSquad | undefined {
    return this.data.find(predicate)
  }

  where(predicate: (item: SURefSquad) => boolean): SURefSquad[] {
    return this.data.filter(predicate)
  }

  findById(id: string): SURefSquad | undefined {
    return this.find((item) => item.id === id)
  }

  findByName(name: string): SURefSquad | undefined {
    return this.find((item) => item.name === name)
  }

  findByHitPoints(hp: number): SURefSquad[] {
    return this.where((s) => s.hitPoints === hp)
  }

  findByMinHitPoints(min: number): SURefSquad[] {
    return this.where((s) => (s.hitPoints ?? 0) >= min)
  }

  findByMinStructurePoints(min: number): SURefSquad[] {
    return this.where((s) => (s.structurePoints ?? 0) >= min)
  }

  getSchema(): Record<string, unknown> {
    return this.schema
  }
}
