import { describe, expect, it } from "vitest";
import {
  abilityModifier,
  initiativeModifier,
  isValidPointBuy,
  level1HitPoints,
  pointBuySpent,
  proficiencyBonus,
  type AbilityScores,
} from "./abilities.js";

const scores = (overrides: Partial<AbilityScores> = {}): AbilityScores => ({
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
  ...overrides,
});

describe("abilityModifier", () => {
  it("calcula floor((score - 10) / 2)", () => {
    expect(abilityModifier(8)).toBe(-1);
    expect(abilityModifier(10)).toBe(0);
    expect(abilityModifier(16)).toBe(3);
  });
});

describe("proficiencyBonus", () => {
  it("sigue la tabla PHB 2024 por nivel", () => {
    expect(proficiencyBonus(1)).toBe(2);
    expect(proficiencyBonus(5)).toBe(3);
    expect(proficiencyBonus(9)).toBe(4);
    expect(proficiencyBonus(13)).toBe(5);
    expect(proficiencyBonus(17)).toBe(6);
    expect(proficiencyBonus(20)).toBe(6);
  });

  it("acota niveles fuera de rango", () => {
    expect(proficiencyBonus(0)).toBe(2);
    expect(proficiencyBonus(99)).toBe(6);
  });
});

describe("point buy", () => {
  it("valida presupuesto de 27 puntos", () => {
    const valid = scores({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
    expect(pointBuySpent(valid)).toBe(27);
    expect(isValidPointBuy(valid)).toBe(true);

    const overBudget = scores({ str: 15, dex: 15, con: 15, int: 12, wis: 10, cha: 8 });
    expect(isValidPointBuy(overBudget)).toBe(false);
  });
});

describe("initiativeModifier", () => {
  it("usa el modificador de Destreza", () => {
    expect(initiativeModifier(scores({ dex: 16 }))).toBe(3);
  });
});

describe("level1HitPoints", () => {
  it("suma dado maximo y mod CON", () => {
    expect(level1HitPoints(10, scores({ con: 14 }))).toBe(12);
  });
});
