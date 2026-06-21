import { MAX_CHAT_LENGTH, type AuthenticatedUser, type CampaignRepository, type ChatRepository } from "@roldninja/domain";
import type { ChatMessageDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";
import { toChatMessageDTO } from "../../mappers.js";

export interface SendChatMessageInput {
  user: AuthenticatedUser;
  campaignId: string;
  content: string;
}

export class SendChatMessage {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly chats: ChatRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ user, campaignId, content }: SendChatMessageInput): Promise<ChatMessageDTO | null> {
    const trimmed = content.trim();
    if (!trimmed) return null;
    await this.access.ensureAccess(campaignId, user.id);
    const msg = await this.chats.create({
      campaignId,
      userId: user.id,
      authorName: user.displayName,
      kind: "USER",
      content: trimmed.slice(0, MAX_CHAT_LENGTH),
    });
    return toChatMessageDTO(msg);
  }
}
