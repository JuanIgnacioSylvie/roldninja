import {
  InitiativeService,
  type CampaignRepository,
  type CampaignStateRepository,
  type CharacterRepository,
  type DiceService,
} from "@roldninja/domain";
import type { CampaignStateDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface RollInitiativeInput {
  userId: string;
  campaignId: string;
  characterId: string;
  value?: number;
}

export class RollInitiative {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
    private readonly states: CampaignStateRepository,
    private readonly dice: DiceService,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId, characterId, value }: RollInitiativeInput): Promise<CampaignStateDTO | null> {
    await this.access.ensureAccess(campaignId, userId);
    const state = await this.states.getOrCreate(campaignId);

    let total = value;
    if (total === undefined) {
      const character = await this.characters.findById(characterId);
      total = InitiativeService.roll(this.dice, character?.sheet.abilityScores);
    }

    if (!state.setParticipantInitiative(characterId, total)) return null;
    await this.states.save(state);
    return state.toSnapshot();
  }
}
