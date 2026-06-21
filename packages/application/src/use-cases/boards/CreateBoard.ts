import type { Board, BoardRepository, CampaignRepository } from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface CreateBoardInput {
  userId: string;
  campaignId: string;
  name: string;
  cols: number;
  rows: number;
  backgroundUrl?: string | null;
}

export class CreateBoard {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly boards: BoardRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute(input: CreateBoardInput): Promise<Board> {
    await this.access.ensureDM(input.campaignId, input.userId);
    return this.boards.create({
      campaignId: input.campaignId,
      name: input.name,
      cols: input.cols,
      rows: input.rows,
      backgroundUrl: input.backgroundUrl ?? null,
    });
  }
}
