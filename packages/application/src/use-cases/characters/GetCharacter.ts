import { NotFoundError, type Character, type CampaignRepository, type CharacterRepository } from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export class GetCharacter {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute(userId: string, characterId: string): Promise<Character> {
    const character = await this.characters.findById(characterId);
    if (!character) throw new NotFoundError("Personaje no encontrado");
    await this.access.ensureAccess(character.campaignId, userId);
    return character;
  }
}
