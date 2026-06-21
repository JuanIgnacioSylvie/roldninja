import type { CharacterSheet, InitiativeEntry } from "@roldninja/domain";
import type {
  BoardDTO,
  CampaignStateDTO,
  ChatMessageDTO,
  TokenDTO,
} from "./dto.js";

/** Eventos que el cliente envia al servidor. */
export interface ClientToServerEvents {
  "campaign:join": (campaignId: string) => void;
  "campaign:leave": (campaignId: string) => void;

  "chat:send": (data: { campaignId: string; content: string }) => void;
  "chat:roll": (data: { campaignId: string; notation: string; label?: string }) => void;

  "character:patchSheet": (data: {
    campaignId: string;
    characterId: string;
    patch: Partial<CharacterSheet>;
  }) => void;

  // Solo DM
  "state:setMode": (data: { campaignId: string; mode: "FREE" | "COMBAT" }) => void;
  "state:setInitiative": (data: { campaignId: string; order: InitiativeEntry[] }) => void;
  "state:nextTurn": (data: { campaignId: string }) => void;
  "state:setActiveBoard": (data: { campaignId: string; boardId: string | null }) => void;

  // Iniciativa (jugador)
  "initiative:roll": (data: { campaignId: string; characterId: string; value?: number }) => void;
  "initiative:cancel": (data: { campaignId: string; characterId: string }) => void;

  // Tablero
  "token:move": (data: { boardId: string; tokenId: string; x: number; y: number }) => void;
  "token:upsert": (data: { boardId: string; token: Partial<TokenDTO> & { id?: string } }) => void;
  "token:remove": (data: { boardId: string; tokenId: string }) => void;
}

/** Eventos que el servidor emite al cliente. */
export interface ServerToClientEvents {
  "chat:message": (msg: ChatMessageDTO) => void;
  "chat:history": (msgs: ChatMessageDTO[]) => void;

  "character:update": (data: { characterId: string; sheet: CharacterSheet }) => void;

  "state:update": (state: CampaignStateDTO) => void;
  "initiative:prompt": (data: { campaignId: string }) => void;

  "board:update": (board: BoardDTO) => void;
  "token:moved": (data: { boardId: string; tokenId: string; x: number; y: number }) => void;

  error: (data: { message: string }) => void;
}

export const SOCKET_PATH = "/socket.io";
