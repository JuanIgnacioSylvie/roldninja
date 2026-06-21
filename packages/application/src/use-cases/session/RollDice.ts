import type { AuthenticatedUser, CampaignRepository, ChatRepository, DiceService } from "@roldninja/domain";
import type { ChatMessageDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";
import { toChatMessageDTO } from "../../mappers.js";

export interface RollDiceInput {
  user: AuthenticatedUser;
  campaignId: string;
  notation: string;
  label?: string;
}

export class RollDice {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly chats: ChatRepository,
    private readonly dice: DiceService,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ user, campaignId, notation, label }: RollDiceInput): Promise<ChatMessageDTO> {
    await this.access.ensureAccess(campaignId, user.id);
    const result = this.dice.roll(notation);
    const text = `${label ? label + ": " : ""}${notation} = ${result.total} [${result.rolls.join(", ")}]`;
    const msg = await this.chats.create({
      campaignId,
      userId: user.id,
      authorName: user.displayName,
      kind: "ROLL",
      content: text,
      payload: result,
    });
    return toChatMessageDTO(msg);
  }
}
