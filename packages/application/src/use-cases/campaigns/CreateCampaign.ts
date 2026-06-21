import { type Campaign, type CampaignRepository, type AuthenticatedUser } from "@roldninja/domain";

export interface CreateCampaignInput {
  user: AuthenticatedUser;
  name: string;
  description?: string;
}

export class CreateCampaign {
  constructor(private readonly campaigns: CampaignRepository) {}

  async execute({ user, name, description }: CreateCampaignInput): Promise<Campaign> {
    return this.campaigns.create({ name, description: description ?? null, dmId: user.id });
  }
}
