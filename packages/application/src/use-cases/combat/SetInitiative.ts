import type { CampaignRepository, CampaignStateRepository, InitiativeEntry } from "@roldninja/domain";
import type { CampaignStateDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface SetInitiativeInput {
  userId: string;
  campaignId: string;
  order: InitiativeEntry[];
}

export class SetInitiative {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId, order }: SetInitiativeInput): Promise<CampaignStateDTO> {
    await this.access.ensureDM(campaignId, userId);
    const state = await this.states.getOrCreate(campaignId);
    state.setInitiativeOrder(order);
    await this.states.save(state);
    return state.toSnapshot();
  }
}
