import type { CampaignState } from "../entities/CampaignState.js";

export interface CampaignStateRepository {
  getOrCreate(campaignId: string): Promise<CampaignState>;
  save(state: CampaignState): Promise<void>;
}
