import { describe, expect, it } from "vitest";
import { mergeCharacterSheet } from "./Character.js";

describe("mergeCharacterSheet", () => {
  it("acota currentHp entre 0 y maxHp", () => {
    const merged = mergeCharacterSheet({ maxHp: 20, currentHp: 15 }, { currentHp: 30 });
    expect(merged.currentHp).toBe(20);

    const healed = mergeCharacterSheet({ maxHp: 20, currentHp: 5 }, { currentHp: -3 });
    expect(healed.currentHp).toBe(0);
  });

  it("no permite tempHp negativo", () => {
    const merged = mergeCharacterSheet({ tempHp: 5 }, { tempHp: -4 });
    expect(merged.tempHp).toBe(0);
  });

  it("fusiona campos sin mutar el original", () => {
    const current = { maxHp: 10, currentHp: 8, conditions: ["Cegado"] as string[] };
    const merged = mergeCharacterSheet(current, { currentHp: 6, conditions: ["Aturdido"] });

    expect(current.currentHp).toBe(8);
    expect(merged.currentHp).toBe(6);
    expect(merged.conditions).toEqual(["Aturdido"]);
  });
});
