export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  dmId: string;
  createdAt: Date;
}

/** Read-model para listar partidas con metadatos agregados. */
export interface CampaignSummary {
  id: string;
  name: string;
  description: string | null;
  dmId: string;
  dmName: string;
  memberCount: number;
  characterCount: number;
}
