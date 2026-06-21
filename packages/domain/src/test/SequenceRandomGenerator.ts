import type { RandomGenerator } from "../rules/random.js";

/** RNG determinista para tests: devuelve valores en orden y repite al agotarse. */
export class SequenceRandomGenerator implements RandomGenerator {
  private index = 0;

  constructor(private readonly sequence: number[]) {}

  rollDie(_sides: number): number {
    const value = this.sequence[this.index % this.sequence.length] ?? 1;
    this.index += 1;
    return value;
  }
}
