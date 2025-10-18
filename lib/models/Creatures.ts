import { BaseModel } from "../BaseModel.js";
import { Creature, SalvageUnionCreatures } from "../types/inferred.js";
import creaturesData from "../../data/creatures.json" with { type: "json" };
import creaturesSchema from "../../schemas/creatures.schema.json" with { type: "json" };

export class CreaturesModel extends BaseModel<Creature> {
  constructor() {
    super(creaturesData as Creature[], creaturesSchema);
  }

  findByHitPoints(hp: number): Creature[] {
    return this.where((c) => c.hitPoints === hp);
  }

  findByMinHitPoints(min: number): Creature[] {
    return this.where((c) => (c.hitPoints ?? 0) >= min);
  }
}
