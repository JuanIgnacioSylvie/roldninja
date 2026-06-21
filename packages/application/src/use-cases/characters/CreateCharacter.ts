import type { Character, CampaignRepository, CharacterRepository } from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface CreateCharacterInput {
  userId: string;
  campaignId: string;
  name: string;
}

export class CreateCharacter {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId, name }: CreateCharacterInput): Promise<Character> {
    await this.access.ensureAccess(campaignId, userId);
    return this.characters.create({ campaignId, ownerId: userId, name });
  }
}
