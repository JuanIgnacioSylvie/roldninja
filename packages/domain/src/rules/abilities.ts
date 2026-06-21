/** Reglas base de D&D 2024 (5.5): caracteristicas, modificadores, competencia, point buy. */

export const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;
export type Ability = (typeof ABILITIES)[number];

export const ABILITY_LABELS: Record<Ability, string> = {
  str: "Fuerza",
  dex: "Destreza",
  con: "Constitucion",
  int: "Inteligencia",
  wis: "Sabiduria",
  cha: "Carisma",
};

export type AbilityScores = Record<Ability, number>;

/** Modificador de caracteristica: floor((score - 10) / 2). */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Bono de competencia por nivel (PHB 2024). */
export function proficiencyBonus(level: number): number {
  return 2 + Math.floor((Math.max(1, Math.min(20, level)) - 1) / 4);
}

/** Costo de Point Buy (PHB 2024): 27 puntos, rango 8-15. */
export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export const POINT_BUY_BUDGET = 27;
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export function pointBuySpent(scores: AbilityScores): number {
  return ABILITIES.reduce((sum, a) => sum + (POINT_BUY_COST[scores[a]] ?? Infinity), 0);
}

export function isValidPointBuy(scores: AbilityScores): boolean {
  const spent = pointBuySpent(scores);
  return Number.isFinite(spent) && spent <= POINT_BUY_BUDGET;
}

/** Iniciativa = d20 + mod de Destreza (aqui solo el modificador). */
export function initiativeModifier(scores: AbilityScores): number {
  return abilityModifier(scores.dex);
}

/** HP a nivel 1: dado de golpe maximo + mod CON. */
export function level1HitPoints(hitDie: number, scores: AbilityScores): number {
  return hitDie + abilityModifier(scores.con);
}
