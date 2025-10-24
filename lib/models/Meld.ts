import meldData from '../../data/meld.json' with { type: 'json' }
import meldSchema from '../../schemas/meld.schema.json' with { type: 'json' }
import type { SURefMeld } from '../types/inferred.js'

export class MeldModel {
  protected data: SURefMeld[]
  protected schema: Record<string, unknown>

  constructor() {
    this.data = meldData as SURefMeld[]
    this.schema = meldSchema as Record<string, unknown>
  }

  all(): SURefMeld[] {
    return this.data
  }

  count(): number {
    return this.data.length
  }

  find(predicate: (item: SURefMeld) => boolean): SURefMeld | undefined {
    return this.data.find(predicate)
  }

  where(predicate: (item: SURefMeld) => boolean): SURefMeld[] {
    return this.data.filter(predicate)
  }

  findById(id: string): SURefMeld | undefined {
    return this.find((item) => item.id === id)
  }

  findByName(name: string): SURefMeld | undefined {
    return this.find((item) => item.name === name)
  }

  findByHitPoints(hp: number): SURefMeld[] {
    return this.where((m) => m.hitPoints === hp)
  }

  findByMinHitPoints(min: number): SURefMeld[] {
    return this.where((m) => (m.hitPoints ?? 0) >= min)
  }

  findByMinStructurePoints(min: number): SURefMeld[] {
    return this.where((m) => (m.structurePoints ?? 0) >= min)
  }

  getSchema(): Record<string, unknown> {
    return this.schema
  }
}
