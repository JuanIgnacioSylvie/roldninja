import type { CampaignRepository } from "@roldninja/domain";
import type { PublicCampaignSummaryDTO } from "@roldninja/contracts";

export class ListPublicCampaigns {
  constructor(private readonly campaigns: CampaignRepository) {}

  async execute(userId: string): Promise<PublicCampaignSummaryDTO[]> {
    const summaries = await this.campaigns.listPublicSummaries(userId);
    return summaries.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      dmName: c.dmName,
      memberCount: c.memberCount,
    }));
  }
}
