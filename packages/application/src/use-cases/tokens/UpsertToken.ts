import type { Board, BoardRepository, CharacterRepository, TokenDraft, TokenRepository } from "@roldninja/domain";

export interface UpsertTokenInput {
  boardId: string;
  token: TokenDraft;
}

export class UpsertToken {
  constructor(
    private readonly boards: BoardRepository,
    private readonly tokens: TokenRepository,
    private readonly characters: CharacterRepository,
  ) {}

  async execute({ boardId, token }: UpsertTokenInput): Promise<Board | null> {
    const board = await this.boards.findById(boardId);
    if (!board) return null;

    if (token.id) {
      await this.tokens.update(token.id, token);
    } else {
      let hp = token.hp ?? null;
      let maxHp = token.maxHp ?? null;
      // Si el token se liga a un personaje sin PG explicitos, toma los de su hoja.
      if (token.characterId && maxHp === null) {
        const character = await this.characters.findById(token.characterId);
        const sheet = character?.sheet;
        if (sheet?.maxHp) {
          maxHp = sheet.maxHp;
          hp = sheet.currentHp ?? sheet.maxHp;
        }
      }
      await this.tokens.create(boardId, { ...token, hp, maxHp });
    }

    return this.boards.findById(boardId);
  }
}
