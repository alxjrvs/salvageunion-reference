import { BaseModel } from "../BaseModel.js";
import { Equipment, SalvageUnionEquipment } from "../types/inferred.js";
import equipmentData from "../../data/equipment.json" with { type: "json" };
import equipmentSchema from "../../schemas/equipment.schema.json" with { type: "json" };

type Trait = NonNullable<Equipment["traits"]>[number];

export class EquipmentModel extends BaseModel<Equipment> {
  constructor() {
    super(equipmentData as Equipment[], equipmentSchema);
  }

  findByTechLevel(level: number): Equipment[] {
    return this.where((e) => e.techLevel === level);
  }

  findByTrait(traitType: string): Equipment[] {
    return this.where(
      (e) => e.traits?.some((t: Trait) => t.type === traitType) ?? false,
    );
  }

  findByActivationCost(cost: number): Equipment[] {
    return this.where((e) => e.activationCost === cost);
  }

  getArmor(): Equipment[] {
    return this.findByTrait("armor");
  }

  getWeapons(): Equipment[] {
    return this.where(
      (e) =>
        e.traits?.some((t: Trait) =>
          ["melee", "ballistic", "energy", "missile"].includes(t.type),
        ) ?? false,
    );
  }

  getWithActions(): Equipment[] {
    return this.where((e) => (e.actions?.length ?? 0) > 0);
  }
}
