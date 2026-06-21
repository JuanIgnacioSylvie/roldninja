import {
  NotFoundError,
  type BoardRepository,
  type CampaignRepository,
  type CampaignStateRepository,
} from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface DeleteBoardInput {
  userId: string;
  boardId: string;
}

export class DeleteBoard {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly boards: BoardRepository,
    private readonly states: CampaignStateRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, boardId }: DeleteBoardInput): Promise<void> {
    const board = await this.boards.findById(boardId);
    if (!board) throw new NotFoundError("Tablero no encontrado");
    await this.access.ensureDM(board.campaignId, userId);

    const state = await this.states.getOrCreate(board.campaignId);
    if (state.toSnapshot().activeBoardId === boardId) {
      state.setActiveBoard(null);
      await this.states.save(state);
    }

    await this.boards.delete(boardId);
  }
}
