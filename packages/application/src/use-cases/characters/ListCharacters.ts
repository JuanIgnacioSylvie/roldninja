import { AccessPolicy, type CampaignRepository, type CharacterRepository } from "@roldninja/domain";
import type { CharacterSummaryDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export class ListCharacters {
  private readonly access: AccessChecker;

  constructor(
    private readonly campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute(userId: string, campaignId: string): Promise<CharacterSummaryDTO[]> {
    const campaign = await this.access.ensureAccess(campaignId, userId);
    const isDM = AccessPolicy.isDM(campaign, userId);

    const summaries = await this.characters.listSummaries(campaignId, isDM ? undefined : userId);
    return summaries.map((c) => ({
      id: c.id,
      name: c.name,
      species: c.species,
      class: c.class,
      background: c.background,
      level: c.level,
      isComplete: c.isComplete,
      ownerName: c.ownerName,
      isMine: c.ownerId === userId,
    }));
  }
}
