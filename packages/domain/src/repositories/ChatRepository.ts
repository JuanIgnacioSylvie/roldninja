import type { ChatKind, ChatMessage } from "../entities/ChatMessage.js";

export interface CreateChatMessageInput {
  campaignId: string;
  userId: string | null;
  authorName: string;
  kind: ChatKind;
  content: string;
  payload?: unknown;
}

export interface ChatRepository {
  listRecent(campaignId: string, limit: number): Promise<ChatMessage[]>;
  create(input: CreateChatMessageInput): Promise<ChatMessage>;
}
