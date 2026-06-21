/** Motor de dados (dominio). Notacion: 1d20+5, 2d6, 4d6kh3 (keep highest 3), etc. */
import type { RandomGenerator } from "./random.js";
import { InvalidDiceNotationError } from "../errors.js";

export interface DiceRoll {
  notation: string;
  rolls: number[];
  kept: number[];
  modifier: number;
  total: number;
}

export interface D20Options {
  modifier?: number;
  advantage?: boolean;
  disadvantage?: boolean;
}

const DICE_RE = /^\s*(\d*)d(\d+)\s*(kh\d+|kl\d+)?\s*([+-]\s*\d+)?\s*$/i;

/**
 * Servicio de dados. La aleatoriedad se inyecta via RandomGenerator, manteniendo
 * la logica de parseo y agregacion 100% pura y testeable.
 */
export class DiceService {
  constructor(private readonly rng: RandomGenerator) {}

  roll(notation: string): DiceRoll {
    const match = DICE_RE.exec(notation);
    if (!match) {
      throw new InvalidDiceNotationError(notation);
    }
    const count = match[1] ? parseInt(match[1], 10) : 1;
    const sides = parseInt(match[2]!, 10);
    const keep = match[3];
    const mod = match[4] ? parseInt(match[4].replace(/\s/g, ""), 10) : 0;

    if (count < 1 || count > 100) throw new InvalidDiceNotationError(notation, "Cantidad de dados fuera de rango (1-100).");
    if (sides < 2 || sides > 1000) throw new InvalidDiceNotationError(notation, "Caras de dado fuera de rango (2-1000).");

    const rolls = Array.from({ length: count }, () => this.rng.rollDie(sides));
    let kept = [...rolls];

    if (keep) {
      const n = parseInt(keep.slice(2), 10);
      const sorted = [...rolls].sort((a, b) => b - a);
      kept = keep.toLowerCase().startsWith("kh") ? sorted.slice(0, n) : sorted.slice(-n);
    }

    const total = kept.reduce((sum, r) => sum + r, 0) + mod;
    return { notation, rolls, kept, modifier: mod, total };
  }

  rollD20({ modifier = 0, advantage = false, disadvantage = false }: D20Options = {}): DiceRoll {
    const net = advantage === disadvantage ? "flat" : advantage ? "adv" : "dis";

    if (net === "flat") {
      const r = this.rng.rollDie(20);
      return { notation: "1d20", rolls: [r], kept: [r], modifier, total: r + modifier };
    }
    const a = this.rng.rollDie(20);
    const b = this.rng.rollDie(20);
    const chosen = net === "adv" ? Math.max(a, b) : Math.min(a, b);
    return {
      notation: net === "adv" ? "2d20kh1" : "2d20kl1",
      rolls: [a, b],
      kept: [chosen],
      modifier,
      total: chosen + modifier,
    };
  }
}
