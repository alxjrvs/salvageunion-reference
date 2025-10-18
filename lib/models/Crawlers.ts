import { BaseModel } from "../BaseModel.js";
import { Crawler, SalvageUnionCrawlers } from "../types/inferred.js";
import crawlersData from "../../data/crawlers.json" with { type: "json" };
import crawlersSchema from "../../schemas/crawlers.schema.json" with { type: "json" };

export class CrawlersModel extends BaseModel<Crawler> {
  constructor() {
    super(crawlersData as Crawler[], crawlersSchema);
  }
}
