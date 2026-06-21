import {
  AccessPolicy,
  type CampaignRepository,
  type CampaignStateRepository,
  type UserRepository,
} from "@roldninja/domain";
import type { CampaignDetailDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export class GetCampaign {
  private readonly access: AccessChecker;

  constructor(
    private readonly campaigns: CampaignRepository,
    private readonly users: UserRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute(userId: string, campaignId: string): Promise<CampaignDetailDTO> {
    const campaign = await this.access.ensureAccess(campaignId, userId);
    const dm = await this.users.findById(campaign.dmId);
    const state = await this.states.getOrCreate(campaignId);

    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      dmName: dm?.displayName ?? "DM",
      isDM: AccessPolicy.isDM(campaign, userId),
      mode: state.mode,
    };
  }
}
