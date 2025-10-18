import { BaseModel } from "../BaseModel.js";
import { BioTitan, SalvageUnionBioTitans } from "../types/inferred.js";
import bioTitansData from "../../data/bio-titans.json" with { type: "json" };
import bioTitansSchema from "../../schemas/bio-titans.schema.json" with { type: "json" };


export class BioTitansModel extends BaseModel<BioTitan> {
  constructor() {
    super(bioTitansData as BioTitan[], bioTitansSchema);
  }

  /**
   * Find bio-titans with minimum structure points
   */
  findByMinStructurePoints(min: number): BioTitan[] {
    return this.where((b) => (b.structurePoints ?? 0) >= min);
  }
}
