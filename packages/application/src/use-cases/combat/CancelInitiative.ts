import type { CampaignRepository, CampaignStateRepository } from "@roldninja/domain";
import type { CampaignStateDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface CancelInitiativeInput {
  userId: string;
  campaignId: string;
  characterId: string;
}

export class CancelInitiative {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId, characterId }: CancelInitiativeInput): Promise<CampaignStateDTO | null> {
    await this.access.ensureAccess(campaignId, userId);
    const state = await this.states.getOrCreate(campaignId);
    if (!state.cancelParticipantInitiative(characterId)) return null;
    await this.states.save(state);
    return state.toSnapshot();
  }
}
