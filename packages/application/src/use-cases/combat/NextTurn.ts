import type { CampaignRepository, CampaignStateRepository } from "@roldninja/domain";
import type { CampaignStateDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface NextTurnInput {
  userId: string;
  campaignId: string;
}

export class NextTurn {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId }: NextTurnInput): Promise<CampaignStateDTO | null> {
    const state = await this.states.getOrCreate(campaignId);
    const isDM = await this.access.isDM(campaignId, userId);
    const ownsCurrent = state.currentParticipant()?.userId === userId;
    // Solo el DM o el dueño del turno actual pueden avanzar.
    if (!isDM && !ownsCurrent) return null;

    state.advanceTurn();
    await this.states.save(state);
    return state.toSnapshot();
  }
}
