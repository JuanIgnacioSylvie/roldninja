import type { RandomGenerator } from "@roldninja/domain";

/** Generador de aleatoriedad basado en Math.random (suficiente para tiradas de mesa). */
export class MathRandomGenerator implements RandomGenerator {
  rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}
