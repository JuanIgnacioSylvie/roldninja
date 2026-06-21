import type { Board, BoardRepository, TokenRepository } from "@roldninja/domain";

export interface RemoveTokenInput {
  boardId: string;
  tokenId: string;
}

export class RemoveToken {
  constructor(
    private readonly boards: BoardRepository,
    private readonly tokens: TokenRepository,
  ) {}

  async execute({ boardId, tokenId }: RemoveTokenInput): Promise<Board | null> {
    const board = await this.boards.findById(boardId);
    if (!board) return null;
    await this.tokens.delete(tokenId);
    return this.boards.findById(boardId);
  }
}
