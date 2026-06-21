import type { Token, TokenDraft } from "../entities/Token.js";

export interface TokenRepository {
  create(boardId: string, draft: TokenDraft): Promise<Token>;
  update(id: string, draft: TokenDraft): Promise<Token | null>;
  move(id: string, x: number, y: number): Promise<void>;
  delete(id: string): Promise<void>;
  listByCharacter(characterId: string): Promise<Token[]>;
}
