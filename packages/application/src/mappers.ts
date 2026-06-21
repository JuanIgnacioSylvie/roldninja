import type { ChatMessage } from "@roldninja/domain";
import type { ChatMessageDTO } from "@roldninja/contracts";

export function toChatMessageDTO(msg: ChatMessage): ChatMessageDTO {
  return {
    id: msg.id,
    campaignId: msg.campaignId,
    userId: msg.userId,
    authorName: msg.authorName,
    kind: msg.kind,
    content: msg.content,
    payload: msg.payload,
    createdAt: msg.createdAt.toISOString(),
  };
}
