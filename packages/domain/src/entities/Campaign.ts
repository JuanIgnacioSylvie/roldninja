/** Método de puntuaciones de característica elegido por el DM al crear la partida. */
export type AbilityScoreMethod = "pointbuy" | "array";

export type CampaignVisibility = "public" | "private";

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  abilityScoreMethod: AbilityScoreMethod;
  visibility: CampaignVisibility;
  joinPasswordHash: string | null;
  dmId: string;
  createdAt: Date;
}

/** Read-model para listar partidas con metadatos agregados. */
export interface CampaignSummary {
  id: string;
  name: string;
  description: string | null;
  visibility: CampaignVisibility;
  dmId: string;
  dmName: string;
  memberCount: number;
  characterCount: number;
}

/** Partida pública visible en el listado de exploración (sin datos sensibles). */
export interface PublicCampaignSummary {
  id: string;
  name: string;
  description: string | null;
  dmName: string;
  memberCount: number;
}
