import { BaseModel } from "../BaseModel.js";
import { Table, SalvageUnionTables } from "../types/inferred.js";
import tablesData from "../../data/tables.json" with { type: "json" };
import tablesSchema from "../../schemas/tables.schema.json" with { type: "json" };


export class TablesModel extends BaseModel<Table> {
  constructor() {
    super(tablesData as Table[], tablesSchema);
  }
}

