import type { PrismaClient } from "@roldninja/db";
import type { CreateWorldMapInput, WorldMap, WorldMapRepository } from "@roldninja/domain";
import { toWorldMap } from "./mappers.js";

export class PrismaWorldMapRepository implements WorldMapRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByCampaign(campaignId: string): Promise<WorldMap[]> {
    const rows = await this.prisma.worldMap.findMany({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toWorldMap);
  }

  async create(input: CreateWorldMapInput): Promise<WorldMap> {
    const row = await this.prisma.worldMap.create({
      data: {
        campaignId: input.campaignId,
        name: input.name,
        type: input.type,
        fileUrl: input.fileUrl ?? null,
      },
    });
    return toWorldMap(row);
  }
}
