import { BaseModel } from "../BaseModel.js";
import { NPC, SalvageUnionNPCs } from "../types/inferred.js";
import npcsData from "../../data/npcs.json" with { type: "json" };
import npcsSchema from "../../schemas/npcs.schema.json" with { type: "json" };


export class NPCsModel extends BaseModel<NPC> {
  constructor() {
    super(npcsData as NPC[], npcsSchema);
  }

  findByHitPoints(hp: number): NPC[] {
    return this.where((n) => n.hitPoints === hp);
  }

  findByMinHitPoints(min: number): NPC[] {
    return this.where((n) => (n.hitPoints ?? 0) >= min);
  }
}
