import type { BoardDTO, CampaignStateDTO, ChatMessageDTO } from "@roldninja/contracts";
import type { CharacterSheet, InitiativeEntry, TokenDraft } from "@roldninja/domain";

export interface RealtimeHandlers {
  onConnect(): void;
  onChatHistory(msgs: ChatMessageDTO[]): void;
  onChatMessage(msg: ChatMessageDTO): void;
  onStateUpdate(state: CampaignStateDTO): void;
  onBoardUpdate(board: BoardDTO): void;
  onTokenMoved(data: { boardId: string; tokenId: string; x: number; y: number }): void;
  onInitiativePrompt(): void;
  onCharacterUpdate(data: { characterId: string; sheet: CharacterSheet }): void;
  onError(message: string): void;
}

/**
 * Puerto de tiempo real. La presentacion lo consume; la implementacion concreta
 * (Socket.IO) vive en infraestructura.
 */
export interface RealtimeGateway {
  connect(token: string): void;
  isConnected(): boolean;
  subscribe(handlers: Partial<RealtimeHandlers>): () => void;

  join(campaignId: string): void;
  leave(campaignId: string): void;

  sendChat(campaignId: string, content: string): void;
  sendRoll(campaignId: string, notation: string, label?: string): void;

  setMode(campaignId: string, mode: "FREE" | "COMBAT"): void;
  nextTurn(campaignId: string): void;
  setInitiative(campaignId: string, order: InitiativeEntry[]): void;
  rollInitiative(campaignId: string, characterId: string, value?: number): void;
  cancelInitiative(campaignId: string, characterId: string): void;
  setActiveBoard(campaignId: string, boardId: string | null): void;

  moveToken(boardId: string, tokenId: string, x: number, y: number): void;
  upsertToken(boardId: string, token: TokenDraft): void;
  removeToken(boardId: string, tokenId: string): void;
  patchSheet(campaignId: string, characterId: string, patch: Partial<CharacterSheet>): void;
}
