export type WorldMapType = "uploaded" | "azgaar";

export interface WorldMap {
  id: string;
  campaignId: string;
  name: string;
  type: WorldMapType;
  fileUrl: string | null;
  createdAt: Date;
}
