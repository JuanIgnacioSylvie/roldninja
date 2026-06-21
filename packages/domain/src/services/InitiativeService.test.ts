import { describe, expect, it } from "vitest";
import type { Character } from "../entities/Character.js";
import { DiceService } from "../rules/dice.js";
import { SequenceRandomGenerator } from "../test/SequenceRandomGenerator.js";
import { InitiativeService } from "./InitiativeService.js";

const character = (overrides: Partial<Character> = {}): Character => ({
  id: "char-1",
  campaignId: "camp-1",
  ownerId: "user-1",
  name: "Aragorn",
  species: "Humano",
  class: "Guerrero",
  background: null,
  level: 1,
  sheet: { abilityScores: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 } },
  isComplete: true,
  ...overrides,
});

describe("InitiativeService", () => {
  it("buildPending crea entradas pendientes por personaje", () => {
    const entries = InitiativeService.buildPending([
      character({ id: "a", name: "A" }),
      character({ id: "b", name: "B", ownerId: "user-2" }),
    ]);

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({
      characterId: "a",
      userId: "user-1",
      name: "A",
      initiative: 0,
      pending: true,
    });
  });

  it("roll suma d20 + mod de Destreza", () => {
    const dice = new DiceService(new SequenceRandomGenerator([12]));
    const total = InitiativeService.roll(dice, character().sheet.abilityScores);
    expect(total).toBe(15);
  });

  it("roll usa 0 de modificador sin puntuaciones", () => {
    const dice = new DiceService(new SequenceRandomGenerator([7]));
    expect(InitiativeService.roll(dice, undefined)).toBe(7);
  });
});
