/**
 * Port de aleatoriedad. La fuente concreta (Math.random, crypto, semilla de test)
 * la provee la capa de infraestructura. El dominio solo depende de esta abstraccion.
 */
export interface RandomGenerator {
  /** Devuelve un entero en el rango [1, sides]. */
  rollDie(sides: number): number;
}
