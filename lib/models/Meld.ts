import meldData from '../../data/meld.json' with { type: 'json' }
import meldSchema from '../../schemas/meld.schema.json' with { type: 'json' }
import type { Meld } from '../types/inferred.js'

export class MeldModel {
  protected data: Meld[]
  protected schema: Record<string, unknown>

  constructor() {
    this.data = meldData as Meld[]
    this.schema = meldSchema as Record<string, unknown>
  }

  all(): Meld[] {
    return this.data
  }

  count(): number {
    return this.data.length
  }

  find(predicate: (item: Meld) => boolean): Meld | undefined {
    return this.data.find(predicate)
  }

  where(predicate: (item: Meld) => boolean): Meld[] {
    return this.data.filter(predicate)
  }

  findById(id: string): Meld | undefined {
    return this.find((item) => item.id === id)
  }

  findByName(name: string): Meld | undefined {
    return this.find((item) => item.name === name)
  }

  findByHitPoints(hp: number): Meld[] {
    return this.where((m) => m.hitPoints === hp)
  }

  findByMinHitPoints(min: number): Meld[] {
    return this.where((m) => (m.hitPoints ?? 0) >= min)
  }

  findByMinStructurePoints(min: number): Meld[] {
    return this.where((m) => (m.structurePoints ?? 0) >= min)
  }

  getSchema(): Record<string, unknown> {
    return this.schema
  }
}
