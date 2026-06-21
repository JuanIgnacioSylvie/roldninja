import type { Board, BoardRepository, CampaignRepository } from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export class ListBoards {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly boards: BoardRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute(userId: string, campaignId: string): Promise<Board[]> {
    await this.access.ensureAccess(campaignId, userId);
    return this.boards.listByCampaign(campaignId);
  }
}
