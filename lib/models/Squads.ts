import squadsData from '../../data/squads.json' with { type: 'json' }
import squadsSchema from '../../schemas/squads.schema.json' with { type: 'json' }
import type { Squad } from '../types/inferred.js'

export class SquadsModel {
  protected data: Squad[]
  protected schema: Record<string, unknown>

  constructor() {
    this.data = squadsData as Squad[]
    this.schema = squadsSchema as Record<string, unknown>
  }

  all(): Squad[] {
    return this.data
  }

  count(): number {
    return this.data.length
  }

  find(predicate: (item: Squad) => boolean): Squad | undefined {
    return this.data.find(predicate)
  }

  where(predicate: (item: Squad) => boolean): Squad[] {
    return this.data.filter(predicate)
  }

  findById(id: string): Squad | undefined {
    return this.find((item) => item.id === id)
  }

  findByName(name: string): Squad | undefined {
    return this.find((item) => item.name === name)
  }

  findByHitPoints(hp: number): Squad[] {
    return this.where((s) => s.hitPoints === hp)
  }

  findByMinHitPoints(min: number): Squad[] {
    return this.where((s) => (s.hitPoints ?? 0) >= min)
  }

  findByMinStructurePoints(min: number): Squad[] {
    return this.where((s) => (s.structurePoints ?? 0) >= min)
  }

  getSchema(): Record<string, unknown> {
    return this.schema
  }
}
