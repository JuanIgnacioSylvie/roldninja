import type {
  AuthenticatedUser,
  Board,
  CampaignMode,
  CampaignStateSnapshot,
  ChatKind,
  Token,
} from "@roldninja/domain";

/** Identidad devuelta al cliente tras login. */
export type AuthUserDTO = AuthenticatedUser;

/** Token y tablero viajan igual que sus entidades (sin fechas). */
export type TokenDTO = Token;
export type BoardDTO = Board;

/** Estado de campaña serializable (igual al snapshot del dominio). */
export type CampaignStateDTO = CampaignStateSnapshot;

export interface ChatMessageDTO {
  id: string;
  campaignId: string;
  userId: string | null;
  authorName: string;
  kind: ChatKind;
  content: string;
  payload?: unknown;
  createdAt: string;
}

export interface CampaignSummaryDTO {
  id: string;
  name: string;
  description: string | null;
  dmName: string;
  isDM: boolean;
  memberCount: number;
  characterCount: number;
}

export interface CampaignDetailDTO {
  id: string;
  name: string;
  description: string | null;
  dmName: string;
  isDM: boolean;
  mode: CampaignMode;
}

export interface CharacterSummaryDTO {
  id: string;
  name: string;
  species: string | null;
  class: string | null;
  background: string | null;
  level: number;
  isComplete: boolean;
  ownerName: string;
  isMine: boolean;
}

export interface LoginResponseDTO {
  token: string;
  user: AuthUserDTO;
}

export interface UploadResultDTO {
  url: string;
  filename: string;
}
