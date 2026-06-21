import type { Campaign, CampaignSummary } from "../entities/Campaign.js";

export interface CreateCampaignInput {
  name: string;
  description?: string | null;
  dmId: string;
}

export interface CampaignRepository {
  findById(id: string): Promise<Campaign | null>;
  isMember(campaignId: string, userId: string): Promise<boolean>;
  listSummariesForUser(userId: string): Promise<CampaignSummary[]>;
  create(input: CreateCampaignInput): Promise<Campaign>;
}
