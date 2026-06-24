"use client";
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
import type {
  ApiGateway,
  CreateBoardArgs,
  CreateWorldMapArgs,
  UpdateBoardArgs,
  WorldMapView,
} from "@/application/ports/ApiGateway";
import { SERVER_URL } from "@/infrastructure/config";
import { useAuth } from "@/infrastructure/state/authStore";

/** Implementacion HTTP del puerto ApiGateway (fetch + JWT desde el authStore). */
export class HttpApiClient implements ApiGateway {
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = useAuth.getState().token;
    const hasBody = options.body != null && options.body !== "";
    const res = await fetch(`${SERVER_URL}${path}`, {
      ...options,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
    if (res.status === 401) useAuth.getState().logout();
    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Error" }));
      throw new Error(body.message ?? `Error ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }

  private get<T>(path: string) {
    return this.request<T>(path);
  }
  private post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
  }
  private patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
  }
  private del(path: string) {
    return this.request<{ success: boolean }>(path, { method: "DELETE" });
  }

  login(username: string, password: string): Promise<LoginResponseDTO> {
    return this.post<LoginResponseDTO>("/auth/login", { username, password });
  }

  listCampaigns(): Promise<CampaignSummaryDTO[]> {
    return this.get<CampaignSummaryDTO[]>("/campaigns");
  }
  listPublicCampaigns(): Promise<PublicCampaignSummaryDTO[]> {
    return this.get<PublicCampaignSummaryDTO[]>("/campaigns/public");
  }
  getCampaign(id: string): Promise<CampaignDetailDTO> {
    return this.get<CampaignDetailDTO>(`/campaigns/${id}`);
  }
  createCampaign(
    name: string,
    description?: string,
    abilityScoreMethod?: "pointbuy" | "array",
    visibility?: "public" | "private",
    joinPassword?: string,
  ): Promise<{ id: string }> {
    return this.post<{ id: string }>("/campaigns", {
      name,
      description,
      abilityScoreMethod,
      visibility,
      joinPassword,
    });
  }
  joinCampaign(campaignId: string, joinPassword?: string): Promise<void> {
    return this.post<void>(`/campaigns/${campaignId}/join`, { joinPassword });
  }

  listCharacters(campaignId: string): Promise<CharacterSummaryDTO[]> {
    return this.get<CharacterSummaryDTO[]>(`/campaigns/${campaignId}/characters`);
  }
  getCharacter(id: string): Promise<Character> {
    return this.get<Character>(`/characters/${id}`);
  }
  createCharacter(campaignId: string, name: string): Promise<{ id: string }> {
    return this.post<{ id: string }>("/characters", { campaignId, name });
  }
  updateCharacter(id: string, patch: Record<string, unknown>): Promise<Character> {
    return this.patch<Character>(`/characters/${id}`, patch);
  }

  listBoards(campaignId: string): Promise<BoardDTO[]> {
    return this.get<BoardDTO[]>(`/campaigns/${campaignId}/boards`);
  }
  createBoard(args: CreateBoardArgs): Promise<BoardDTO> {
    return this.post<BoardDTO>("/boards", args);
  }
  updateBoard(id: string, patch: UpdateBoardArgs): Promise<BoardDTO> {
    return this.patch<BoardDTO>(`/boards/${id}`, patch);
  }
  async deleteBoard(id: string): Promise<void> {
    await this.del(`/boards/${id}`);
  }

  listWorldMaps(campaignId: string): Promise<WorldMapView[]> {
    return this.get<WorldMapView[]>(`/campaigns/${campaignId}/maps`);
  }
  createWorldMap(args: CreateWorldMapArgs): Promise<WorldMapView> {
    return this.post<WorldMapView>("/maps", args);
  }

  async uploadFile(file: File): Promise<UploadResultDTO> {
    const token = useAuth.getState().token;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${SERVER_URL}/uploads`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error("Fallo la subida");
    return res.json();
  }
}
