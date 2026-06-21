import type { WorldMap, WorldMapRepository, WorldMapType } from "@roldninja/domain";

export interface CreateWorldMapInput {
  campaignId: string;
  name: string;
  type: WorldMapType;
  fileUrl?: string | null;
}

export class CreateWorldMap {
  constructor(private readonly maps: WorldMapRepository) {}

  execute(input: CreateWorldMapInput): Promise<WorldMap> {
    return this.maps.create({
      campaignId: input.campaignId,
      name: input.name,
      type: input.type,
      fileUrl: input.fileUrl ?? null,
    });
  }
}
