import type { AbilityScoreMethod, Campaign, CampaignSummary, CampaignVisibility, PublicCampaignSummary } from "../entities/Campaign.js";

export interface CreateCampaignInput {
  name: string;
  description?: string | null;
  abilityScoreMethod?: AbilityScoreMethod;
  visibility?: CampaignVisibility;
  joinPasswordHash?: string | null;
  dmId: string;
}

export interface CampaignRepository {
  findById(id: string): Promise<Campaign | null>;
  isMember(campaignId: string, userId: string): Promise<boolean>;
  listSummariesForUser(userId: string): Promise<CampaignSummary[]>;
  listPublicSummaries(excludeUserId: string): Promise<PublicCampaignSummary[]>;
  create(input: CreateCampaignInput): Promise<Campaign>;
  addMember(campaignId: string, userId: string): Promise<void>;
}
