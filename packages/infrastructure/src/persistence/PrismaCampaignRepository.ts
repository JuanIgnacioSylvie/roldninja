import type { PrismaClient } from "@roldninja/db";
import type {
  Campaign,
  CampaignRepository,
  CampaignSummary,
  CreateCampaignInput,
} from "@roldninja/domain";
import { toCampaign } from "./mappers.js";

export class PrismaCampaignRepository implements CampaignRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Campaign | null> {
    const row = await this.prisma.campaign.findUnique({ where: { id } });
    return row ? toCampaign(row) : null;
  }

  async isMember(campaignId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.campaignMembership.count({ where: { campaignId, userId } });
    return count > 0;
  }

  async listSummariesForUser(userId: string): Promise<CampaignSummary[]> {
    const rows = await this.prisma.campaign.findMany({
      where: { OR: [{ dmId: userId }, { members: { some: { userId } } }] },
      include: {
        dm: { select: { displayName: true } },
        _count: { select: { members: true, characters: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      dmId: c.dmId,
      dmName: c.dm.displayName,
      memberCount: c._count.members,
      characterCount: c._count.characters,
    }));
  }

  async create(input: CreateCampaignInput): Promise<Campaign> {
    const row = await this.prisma.campaign.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        dmId: input.dmId,
        state: { create: {} },
      },
    });
    return toCampaign(row);
  }
}
