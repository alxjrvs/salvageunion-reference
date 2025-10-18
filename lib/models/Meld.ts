import meldData from "../../data/meld.json" with { type: "json" };
import meldSchema from "../../schemas/meld.schema.json" with { type: "json" };

interface Meld {
  id: string;
  name: string;
  source: string;
  description?: string;
  hitPoints?: number;
  structurePoints?: number;
  salvageValue?: number;
  abilities?: any[];
  traits?: any[];
  page: number;
}

export class MeldModel {
  protected data: Meld[];
  protected schema: any;

  constructor() {
    this.data = meldData as Meld[];
    this.schema = meldSchema;
  }

  all(): Meld[] {
    return this.data;
  }

  count(): number {
    return this.data.length;
  }

  find(predicate: (item: Meld) => boolean): Meld | undefined {
    return this.data.find(predicate);
  }

  where(predicate: (item: Meld) => boolean): Meld[] {
    return this.data.filter(predicate);
  }

  findById(id: string): Meld | undefined {
    return this.find((item) => item.id === id);
  }

  findByName(name: string): Meld | undefined {
    return this.find((item) => item.name === name);
  }

  findByHitPoints(hp: number): Meld[] {
    return this.where((m) => m.hitPoints === hp);
  }

  findByMinHitPoints(min: number): Meld[] {
    return this.where((m) => (m.hitPoints ?? 0) >= min);
  }

  findByMinStructurePoints(min: number): Meld[] {
    return this.where((m) => (m.structurePoints ?? 0) >= min);
  }

  getSchema(): any {
    return this.schema;
  }
}
