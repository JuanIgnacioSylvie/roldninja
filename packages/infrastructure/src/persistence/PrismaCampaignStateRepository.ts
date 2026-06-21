import type { PrismaClient } from "@roldninja/db";
import {
  CampaignState,
  type CampaignStateRepository,
  type InitiativeEntry,
} from "@roldninja/domain";

export class PrismaCampaignStateRepository implements CampaignStateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getOrCreate(campaignId: string): Promise<CampaignState> {
    const row = await this.prisma.campaignState.upsert({
      where: { campaignId },
      update: {},
      create: { campaignId },
    });
    return CampaignState.fromSnapshot({
      campaignId: row.campaignId,
      mode: row.mode,
      activeBoardId: row.activeBoardId ?? null,
      round: row.round,
      turnIndex: row.turnIndex,
      initiative: (row.initiative as unknown as InitiativeEntry[]) ?? [],
    });
  }

  async save(state: CampaignState): Promise<void> {
    const snapshot = state.toSnapshot();
    await this.prisma.campaignState.update({
      where: { campaignId: snapshot.campaignId },
      data: {
        mode: snapshot.mode,
        activeBoardId: snapshot.activeBoardId,
        round: snapshot.round,
        turnIndex: snapshot.turnIndex,
        initiative: snapshot.initiative as object,
      },
    });
  }
}
