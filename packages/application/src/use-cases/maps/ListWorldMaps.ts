import type { WorldMap, WorldMapRepository } from "@roldninja/domain";

export class ListWorldMaps {
  constructor(private readonly maps: WorldMapRepository) {}

  execute(campaignId: string): Promise<WorldMap[]> {
    return this.maps.listByCampaign(campaignId);
  }
}
