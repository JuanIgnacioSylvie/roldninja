import { abilityModifier, type AbilityScores } from "../rules/abilities.js";
import type { DiceService } from "../rules/dice.js";
import type { Character } from "../entities/Character.js";
import type { InitiativeEntry } from "../entities/CampaignState.js";

/** Logica de iniciativa de combate (dominio puro). */
export const InitiativeService = {
  /** Crea las entradas de iniciativa (pendientes de tirar) para los personajes dados. */
  buildPending(characters: Character[]): InitiativeEntry[] {
    return characters.map((c) => ({
      characterId: c.id,
      userId: c.ownerId,
      name: c.name,
      initiative: 0,
      pending: true,
      imageUrl: c.sheet?.portraitUrl ?? null,
      color: "#3b82f6",
      kind: "player" as const,
    }));
  },

  /** Tira iniciativa: d20 + mod de Destreza (0 si no hay puntuaciones). */
  roll(dice: DiceService, scores: AbilityScores | undefined): number {
    const mod = scores ? abilityModifier(scores.dex) : 0;
    return dice.rollD20({ modifier: mod }).total;
  },
};
