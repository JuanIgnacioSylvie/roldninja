import { AccessPolicy, ForbiddenError, type BoardRepository, type CampaignRepository, type CharacterRepository, type TokenRepository } from "@roldninja/domain";

export interface MoveTokenInput {
  userId: string;
  boardId: string;
  tokenId: string;
  x: number;
  y: number;
}

export interface MoveTokenResult {
  campaignId: string;
  boardId: string;
  tokenId: string;
  x: number;
  y: number;
}

export class MoveToken {
  constructor(
    private readonly boards: BoardRepository,
    private readonly tokens: TokenRepository,
    private readonly campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
  ) {}

  async execute({ userId, boardId, tokenId, x, y }: MoveTokenInput): Promise<MoveTokenResult | null> {
    const board = await this.boards.findById(boardId);
    if (!board) return null;

    const token = board.tokens.find((t) => t.id === tokenId);
    if (!token) return null;

    const campaign = await this.campaigns.findById(board.campaignId);
    if (!campaign) return null;

    if (!AccessPolicy.isDM(campaign, userId)) {
      if (!token.characterId) throw new ForbiddenError("No podés mover este token");
      const character = await this.characters.findById(token.characterId);
      if (!character || character.ownerId !== userId) {
        throw new ForbiddenError("Solo podés mover tu propio token");
      }
    }

    await this.tokens.move(tokenId, x, y);
    return { campaignId: board.campaignId, boardId, tokenId, x, y };
  }
}
