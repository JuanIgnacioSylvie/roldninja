import {
  AccessPolicy,
  ForbiddenError,
  NotFoundError,
  type Campaign,
  type CampaignRepository,
} from "@roldninja/domain";

/** Resuelve acceso/rol contra el repositorio de partidas (reusado por casos de uso). */
export class AccessChecker {
  constructor(private readonly campaigns: CampaignRepository) {}

  async getCampaign(campaignId: string): Promise<Campaign> {
    const campaign = await this.campaigns.findById(campaignId);
    if (!campaign) throw new NotFoundError("Partida no encontrada");
    return campaign;
  }

  async canAccess(campaignId: string, userId: string): Promise<boolean> {
    const campaign = await this.campaigns.findById(campaignId);
    if (!campaign) return false;
    if (AccessPolicy.isDM(campaign, userId)) return true;
    return this.campaigns.isMember(campaignId, userId);
  }

  async ensureAccess(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await this.getCampaign(campaignId);
    if (AccessPolicy.isDM(campaign, userId)) return campaign;
    if (await this.campaigns.isMember(campaignId, userId)) return campaign;
    throw new ForbiddenError("Sin acceso a la partida");
  }

  async ensureDM(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await this.getCampaign(campaignId);
    if (!AccessPolicy.isDM(campaign, userId)) {
      throw new ForbiddenError("Solo el DM puede hacer esto");
    }
    return campaign;
  }

  async isDM(campaignId: string, userId: string): Promise<boolean> {
    const campaign = await this.campaigns.findById(campaignId);
    return campaign ? AccessPolicy.isDM(campaign, userId) : false;
  }
}
