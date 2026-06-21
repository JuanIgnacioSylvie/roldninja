import type { AbilityScores } from "../rules/abilities.js";

export interface DeathSaves {
  successes: number;
  failures: number;
}

export const CONDITIONS_2024 = [
  "Agarrado",
  "Apresado",
  "Asustado",
  "Aturdido",
  "Cegado",
  "Derribado",
  "Ensordecido",
  "Envenenado",
  "Exhausto",
  "Hechizado",
  "Incapacitado",
  "Inconsciente",
  "Invisible",
  "Paralizado",
  "Petrificado",
] as const;

/** Un ataque o truco de daño de la hoja (sección "Armas y trucos de daño"). */
export interface Attack {
  name: string;
  /** Bonificador de ataque o CD, ej "+5" o "CD 13". */
  bonus: string;
  /** Daño y tipo, ej "1d8+3 cortante". */
  damage: string;
  notes?: string;
}

/** Monedas del personaje (PC/PP/PE/PO/PPT). */
export interface Coins {
  cp: number; // piezas de cobre
  sp: number; // piezas de plata
  ep: number; // piezas de electro
  gp: number; // piezas de oro
  pp: number; // piezas de platino
}

/** Espacios de conjuro de un nivel (gastados / totales). */
export interface SpellSlot {
  total: number;
  used: number;
}

/** Entrenamiento con armaduras (ligeras/medias/pesadas/escudos). */
export interface ArmorTraining {
  light: boolean;
  medium: boolean;
  heavy: boolean;
  shields: boolean;
}

/** Value object: hoja de personaje (resultado del wizard de creacion). */
export interface CharacterSheet {
  abilityScores: AbilityScores;
  skillProficiencies: string[];
  savingThrows: string[];
  maxHp: number;
  currentHp: number;
  tempHp?: number;
  deathSaves?: DeathSaves;
  conditions?: string[];
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
  hitDie: number;
  features: string[];
  equipment: string[];
  spells?: string[];
  notes?: string;
  /** Imagen del personaje; se usa como token en el tablero. */
  portraitUrl?: string;

  // --- Campos de la hoja oficial 2024 (todos opcionales para compatibilidad) ---
  xp?: number;
  subclass?: string;
  alignment?: string;
  size?: string;
  /** Inspiración heroica disponible. */
  heroicInspiration?: boolean;
  /** Bonificador extra de iniciativa más allá del mod. de Destreza. */
  initiativeBonus?: number;
  /** Percepción pasiva manual (si no se setea, se calcula). */
  passivePerception?: number;
  /** Dados de golpe gastados (el total = nivel). */
  hitDiceUsed?: number;
  attacks?: Attack[];
  /** Rasgos de especie (separados de features genéricos). */
  speciesTraits?: string[];
  /** Rasgos de clase. */
  classFeatures?: string[];
  /** Dotes. */
  feats?: string[];
  languages?: string[];
  coins?: Coins;
  armorTraining?: ArmorTraining;
  weaponProficiencies?: string;
  toolProficiencies?: string;
  // Conjuros
  spellcastingAbility?: string;
  spellSaveDc?: number;
  spellAttackBonus?: number;
  /** Espacios por nivel 1..9. */
  spellSlots?: Record<number, SpellSlot>;
  cantrips?: string[];
  preparedSpells?: string[];
  // Historia y aspecto
  appearance?: string;
  personality?: string;
  backstory?: string;
  attunedItems?: string[];
}

export interface Character {
  id: string;
  campaignId: string;
  ownerId: string;
  name: string;
  species: string | null;
  class: string | null;
  background: string | null;
  level: number;
  sheet: Partial<CharacterSheet>;
  isComplete: boolean;
}

/** Read-model para listar personajes de una partida. */
export interface CharacterSummary {
  id: string;
  name: string;
  species: string | null;
  class: string | null;
  background: string | null;
  level: number;
  isComplete: boolean;
  ownerId: string;
  ownerName: string;
}

/**
 * Aplica un parche a una hoja respetando las reglas de PG:
 * - currentHp se acota a [0, maxHp]
 * - tempHp no puede ser negativo
 * Devuelve una hoja nueva (inmutable).
 */
export function mergeCharacterSheet(
  current: Partial<CharacterSheet>,
  patch: Partial<CharacterSheet>,
): Partial<CharacterSheet> {
  const merged: Partial<CharacterSheet> = { ...current, ...patch };

  const maxHp = typeof merged.maxHp === "number" ? merged.maxHp : 0;
  if (typeof merged.currentHp === "number") {
    merged.currentHp = Math.max(0, Math.min(maxHp || merged.currentHp, merged.currentHp));
  }
  if (typeof merged.tempHp === "number") {
    merged.tempHp = Math.max(0, merged.tempHp);
  }
  return merged;
}
