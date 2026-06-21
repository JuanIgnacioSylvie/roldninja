export type ChatKind = "USER" | "SYSTEM" | "ROLL";

export interface ChatMessage {
  id: string;
  campaignId: string;
  userId: string | null;
  authorName: string;
  kind: ChatKind;
  content: string;
  payload?: unknown;
  createdAt: Date;
}

export const MAX_CHAT_LENGTH = 2000;
