import type { CampaignRepository, CampaignStateRepository, ChatRepository } from "@roldninja/domain";
import type { CampaignStateDTO, ChatMessageDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";
import { toChatMessageDTO } from "../../mappers.js";

export interface JoinCampaignResult {
  history: ChatMessageDTO[];
  state: CampaignStateDTO;
}

export class JoinCampaign {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly chats: ChatRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute(userId: string, campaignId: string): Promise<JoinCampaignResult> {
    await this.access.ensureAccess(campaignId, userId);
    const history = (await this.chats.listRecent(campaignId, 100)).map(toChatMessageDTO);
    const state = (await this.states.getOrCreate(campaignId)).toSnapshot();
    return { history, state };
  }
}
