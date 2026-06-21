import {
  NotFoundError,
  type Board,
  type BoardRepository,
  type CampaignRepository,
  type UpdateBoardInput as RepoUpdateInput,
} from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface UpdateBoardInput {
  userId: string;
  boardId: string;
  patch: RepoUpdateInput;
}

export class UpdateBoard {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly boards: BoardRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ userId, boardId, patch }: UpdateBoardInput): Promise<Board> {
    const board = await this.boards.findById(boardId);
    if (!board) throw new NotFoundError("Tablero no encontrado");
    await this.access.ensureDM(board.campaignId, userId);
    return this.boards.update(boardId, patch);
  }
}
