import type { Character } from "@roldninja/domain";
import type {
  BoardDTO,
  CampaignDetailDTO,
  CampaignSummaryDTO,
  CharacterSummaryDTO,
  LoginResponseDTO,
  PublicCampaignSummaryDTO,
  UploadResultDTO,
} from "@roldninja/contracts";

export interface WorldMapView {
  id: string;
  name: string;
  type: string;
  fileUrl: string | null;
}

export interface CreateBoardArgs {
  campaignId: string;
  name: string;
  cols: number;
  rows: number;
  backgroundUrl?: string | null;
}

export interface UpdateBoardArgs {
  name?: string;
  cols?: number;
  rows?: number;
  backgroundUrl?: string | null;
  gridColor?: string;
  gridOpacity?: number;
  gridLineWidth?: number;
  isActive?: boolean;
}

export interface CreateWorldMapArgs {
  campaignId: string;
  name: string;
  type: "uploaded" | "azgaar";
  fileUrl?: string | null;
}

/**
 * Puerto de acceso al backend (REST). La presentacion depende de esta abstraccion;
 * la implementacion concreta (HTTP) vive en infraestructura.
 */
export interface ApiGateway {
  login(username: string, password: string): Promise<LoginResponseDTO>;

  listCampaigns(): Promise<CampaignSummaryDTO[]>;
  listPublicCampaigns(): Promise<PublicCampaignSummaryDTO[]>;
  getCampaign(id: string): Promise<CampaignDetailDTO>;
  createCampaign(
    name: string,
    description?: string,
    abilityScoreMethod?: "pointbuy" | "array",
    visibility?: "public" | "private",
    joinPassword?: string,
  ): Promise<{ id: string }>;
  joinCampaign(campaignId: string, joinPassword?: string): Promise<void>;

  listCharacters(campaignId: string): Promise<CharacterSummaryDTO[]>;
  getCharacter(id: string): Promise<Character>;
  createCharacter(campaignId: string, name: string): Promise<{ id: string }>;
  updateCharacter(id: string, patch: Record<string, unknown>): Promise<Character>;

  listBoards(campaignId: string): Promise<BoardDTO[]>;
  createBoard(args: CreateBoardArgs): Promise<BoardDTO>;
  updateBoard(id: string, patch: UpdateBoardArgs): Promise<BoardDTO>;
  deleteBoard(id: string): Promise<void>;

  listWorldMaps(campaignId: string): Promise<WorldMapView[]>;
  createWorldMap(args: CreateWorldMapArgs): Promise<WorldMapView>;

  uploadFile(file: File): Promise<UploadResultDTO>;
}
