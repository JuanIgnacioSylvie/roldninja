import type { PrismaClient } from "@roldninja/db";
import type {
  Character,
  CharacterRepository,
  CharacterSummary,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "@roldninja/domain";
import { toCharacter } from "./mappers.js";

export class PrismaCharacterRepository implements CharacterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Character | null> {
    const row = await this.prisma.character.findUnique({ where: { id } });
    return row ? toCharacter(row) : null;
  }

  async listSummaries(campaignId: string, ownerId?: string): Promise<CharacterSummary[]> {
    const rows = await this.prisma.character.findMany({
      where: { campaignId, ...(ownerId ? { ownerId } : {}) },
      include: { owner: { select: { displayName: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      species: c.species ?? null,
      class: c.class ?? null,
      background: c.background ?? null,
      level: c.level,
      isComplete: c.isComplete,
      ownerId: c.ownerId,
      ownerName: c.owner.displayName,
    }));
  }

  async listCombatants(campaignId: string, excludeOwnerId: string): Promise<Character[]> {
    const rows = await this.prisma.character.findMany({
      where: { campaignId, isComplete: true, NOT: { ownerId: excludeOwnerId } },
    });
    return rows.map(toCharacter);
  }

  async create(input: CreateCharacterInput): Promise<Character> {
    const row = await this.prisma.character.create({
      data: { campaignId: input.campaignId, ownerId: input.ownerId, name: input.name },
    });
    return toCharacter(row);
  }

  async update(id: string, patch: UpdateCharacterInput): Promise<Character> {
    const { sheet, ...rest } = patch;
    const row = await this.prisma.character.update({
      where: { id },
      data: { ...rest, ...(sheet !== undefined ? { sheet: sheet as object } : {}) },
    });
    return toCharacter(row);
  }
}
