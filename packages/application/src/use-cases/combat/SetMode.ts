import {
  InitiativeService,
  type CampaignMode,
  type CampaignRepository,
  type CampaignStateRepository,
  type CharacterRepository,
} from "@roldninja/domain";
import type { CampaignStateDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface SetModeInput {
  userId: string;
  campaignId: string;
  mode: CampaignMode;
}

export interface SetModeResult {
  state: CampaignStateDTO;
  promptInitiative: boolean;
}

export class SetMode {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId, mode }: SetModeInput): Promise<SetModeResult> {
    const campaign = await this.access.ensureDM(campaignId, userId);
    const state = await this.states.getOrCreate(campaignId);

    if (mode === "COMBAT") {
      const combatants = await this.characters.listCombatants(campaignId, campaign.dmId);
      state.startCombat(InitiativeService.buildPending(combatants));
      await this.states.save(state);
      return { state: state.toSnapshot(), promptInitiative: true };
    }

    state.endCombat();
    await this.states.save(state);
    return { state: state.toSnapshot(), promptInitiative: false };
  }
}
