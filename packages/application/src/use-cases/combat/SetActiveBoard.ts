import type { BoardRepository, CampaignRepository, CampaignStateRepository } from "@roldninja/domain";
import type { CampaignStateDTO } from "@roldninja/contracts";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface SetActiveBoardInput {
  userId: string;
  campaignId: string;
  boardId: string | null;
}

export class SetActiveBoard {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly boards: BoardRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, campaignId, boardId }: SetActiveBoardInput): Promise<CampaignStateDTO> {
    await this.access.ensureDM(campaignId, userId);
    const state = await this.states.getOrCreate(campaignId);
    state.setActiveBoard(boardId);
    await this.states.save(state);
    if (boardId) await this.boards.setActiveExclusive(campaignId, boardId);
    return state.toSnapshot();
  }
}
