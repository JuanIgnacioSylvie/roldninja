import type { CampaignRepository } from "@roldninja/domain";
import type { CampaignSummaryDTO } from "@roldninja/contracts";

export class ListCampaigns {
  constructor(private readonly campaigns: CampaignRepository) {}

  async execute(userId: string): Promise<CampaignSummaryDTO[]> {
    const summaries = await this.campaigns.listSummariesForUser(userId);
    return summaries.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      dmName: c.dmName,
      isDM: c.dmId === userId,
      memberCount: c.memberCount,
      characterCount: c.characterCount,
    }));
  }
}
