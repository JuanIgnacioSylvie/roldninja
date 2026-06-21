import type { WorldMap, WorldMapType } from "../entities/WorldMap.js";

export interface CreateWorldMapInput {
  campaignId: string;
  name: string;
  type: WorldMapType;
  fileUrl?: string | null;
}

export interface WorldMapRepository {
  listByCampaign(campaignId: string): Promise<WorldMap[]>;
  create(input: CreateWorldMapInput): Promise<WorldMap>;
}
