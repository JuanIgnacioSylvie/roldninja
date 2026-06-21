import type { Board } from "../entities/Board.js";

export interface CreateBoardInput {
  campaignId: string;
  name: string;
  cols: number;
  rows: number;
  backgroundUrl?: string | null;
}

export interface UpdateBoardInput {
  name?: string;
  cols?: number;
  rows?: number;
  backgroundUrl?: string | null;
  gridColor?: string;
  gridOpacity?: number;
  gridLineWidth?: number;
  isActive?: boolean;
}

export interface BoardRepository {
  listByCampaign(campaignId: string): Promise<Board[]>;
  findById(id: string): Promise<Board | null>;
  create(input: CreateBoardInput): Promise<Board>;
  update(id: string, patch: UpdateBoardInput): Promise<Board>;
  /** Activa un tablero y desactiva el resto de la partida. */
  setActiveExclusive(campaignId: string, boardId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
