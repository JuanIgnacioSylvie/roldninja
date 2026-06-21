import { describe, expect, it } from "vitest";
import { InvalidDiceNotationError } from "../errors.js";
import { SequenceRandomGenerator } from "../test/SequenceRandomGenerator.js";
import { DiceService } from "./dice.js";

describe("DiceService", () => {
  it("tira un dado simple", () => {
    const dice = new DiceService(new SequenceRandomGenerator([12]));
    const roll = dice.roll("1d20");
    expect(roll.rolls).toEqual([12]);
    expect(roll.kept).toEqual([12]);
    expect(roll.total).toBe(12);
  });

  it("aplica modificadores", () => {
    const dice = new DiceService(new SequenceRandomGenerator([10]));
    const roll = dice.roll("1d20+5");
    expect(roll.modifier).toBe(5);
    expect(roll.total).toBe(15);
  });

  it("conserva los N mas altos (4d6kh3)", () => {
    const dice = new DiceService(new SequenceRandomGenerator([1, 6, 3, 5]));
    const roll = dice.roll("4d6kh3");
    expect(roll.rolls).toEqual([1, 6, 3, 5]);
    expect(roll.kept).toEqual([6, 5, 3]);
    expect(roll.total).toBe(14);
  });

  it("conserva los N mas bajos (2d20kl1)", () => {
    const dice = new DiceService(new SequenceRandomGenerator([18, 4]));
    const roll = dice.roll("2d20kl1");
    expect(roll.kept).toEqual([4]);
    expect(roll.total).toBe(4);
  });

  it("tira d20 con ventaja", () => {
    const dice = new DiceService(new SequenceRandomGenerator([8, 17]));
    const roll = dice.rollD20({ advantage: true });
    expect(roll.rolls).toEqual([8, 17]);
    expect(roll.kept).toEqual([17]);
    expect(roll.total).toBe(17);
  });

  it("tira d20 con desventaja", () => {
    const dice = new DiceService(new SequenceRandomGenerator([8, 17]));
    const roll = dice.rollD20({ disadvantage: true });
    expect(roll.kept).toEqual([8]);
    expect(roll.total).toBe(8);
  });

  it("ignora ventaja y desventaja simultaneas", () => {
    const dice = new DiceService(new SequenceRandomGenerator([11]));
    const roll = dice.rollD20({ advantage: true, disadvantage: true, modifier: 2 });
    expect(roll.rolls).toEqual([11]);
    expect(roll.total).toBe(13);
  });

  it("rechaza notacion invalida", () => {
    const dice = new DiceService(new SequenceRandomGenerator([1]));
    expect(() => dice.roll("not-a-die")).toThrow(InvalidDiceNotationError);
    expect(() => dice.roll("0d20")).toThrow(InvalidDiceNotationError);
  });
});
