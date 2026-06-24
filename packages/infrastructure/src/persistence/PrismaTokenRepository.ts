import type { PrismaClient } from "@roldninja/db";
import { DEFAULT_TOKEN, type Token, type TokenDraft, type TokenRepository } from "@roldninja/domain";
import { toToken } from "./mappers.js";

function normalizeTokenSize(size: number | undefined): number {
  const value = size ?? DEFAULT_TOKEN.size;
  return Math.max(0.5, value);
}

export class PrismaTokenRepository implements TokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(boardId: string, draft: TokenDraft): Promise<Token> {
    const row = await this.prisma.token.create({
      data: {
        boardId,
        label: draft.label ?? DEFAULT_TOKEN.label,
        x: draft.x ?? DEFAULT_TOKEN.x,
        y: draft.y ?? DEFAULT_TOKEN.y,
        color: draft.color ?? DEFAULT_TOKEN.color,
        imageUrl: draft.imageUrl ?? null,
        size: normalizeTokenSize(draft.size),
        characterId: draft.characterId ?? null,
        hidden: draft.hidden ?? DEFAULT_TOKEN.hidden,
        hp: draft.hp ?? null,
        maxHp: draft.maxHp ?? null,
      },
    });
    return toToken(row);
  }

  async update(id: string, draft: TokenDraft): Promise<Token | null> {
    try {
      const row = await this.prisma.token.update({
        where: { id },
        data: {
          label: draft.label,
          x: draft.x,
          y: draft.y,
          color: draft.color,
          imageUrl: draft.imageUrl === undefined ? undefined : draft.imageUrl,
          size: draft.size === undefined ? undefined : normalizeTokenSize(draft.size),
          characterId: draft.characterId === undefined ? undefined : draft.characterId,
          hidden: draft.hidden,
          hp: draft.hp === undefined ? undefined : draft.hp,
          maxHp: draft.maxHp === undefined ? undefined : draft.maxHp,
        },
      });
      return toToken(row);
    } catch {
      return null;
    }
  }

  async move(id: string, x: number, y: number): Promise<void> {
    try {
      await this.prisma.token.update({ where: { id }, data: { x, y } });
    } catch {
      /* token inexistente: ignorar */
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.token.delete({ where: { id } });
    } catch {
      /* token inexistente: ignorar */
    }
  }

  async listByCharacter(characterId: string): Promise<Token[]> {
    const rows = await this.prisma.token.findMany({ where: { characterId } });
    return rows.map(toToken);
  }
}
