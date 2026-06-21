import type { Character, CharacterSheet, CharacterSummary } from "../entities/Character.js";

export interface CreateCharacterInput {
  campaignId: string;
  ownerId: string;
  name: string;
}

export interface UpdateCharacterInput {
  name?: string;
  species?: string | null;
  class?: string | null;
  background?: string | null;
  level?: number;
  sheet?: Partial<CharacterSheet>;
  isComplete?: boolean;
}

export interface CharacterRepository {
  findById(id: string): Promise<Character | null>;
  /** Resumenes de personajes de una partida; opcionalmente filtrado por dueño. */
  listSummaries(campaignId: string, ownerId?: string): Promise<CharacterSummary[]>;
  /** Personajes completos de jugadores (excluye al DM) para armar la iniciativa. */
  listCombatants(campaignId: string, excludeOwnerId: string): Promise<Character[]>;
  create(input: CreateCharacterInput): Promise<Character>;
  update(id: string, patch: UpdateCharacterInput): Promise<Character>;
}
