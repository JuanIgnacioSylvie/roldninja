import type { CharacterSheet, Coins } from "@roldninja/domain";

export interface SheetMeta {
  name: string;
  species: string;
  class: string;
  background: string;
  level: number;
}

export function emptyCoins(): Coins {
  return { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
}

export function normalizeSheet(s: Partial<CharacterSheet>): CharacterSheet {
  return {
    abilityScores: s.abilityScores ?? { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skillProficiencies: s.skillProficiencies ?? [],
    savingThrows: s.savingThrows ?? [],
    maxHp: s.maxHp ?? 1,
    currentHp: s.currentHp ?? s.maxHp ?? 1,
    tempHp: s.tempHp ?? 0,
    deathSaves: s.deathSaves ?? { successes: 0, failures: 0 },
    conditions: s.conditions ?? [],
    armorClass: s.armorClass ?? 10,
    speed: s.speed ?? 30,
    proficiencyBonus: s.proficiencyBonus ?? 2,
    hitDie: s.hitDie ?? 8,
    features: s.features ?? [],
    equipment: s.equipment ?? [],
    spells: s.spells ?? [],
    notes: s.notes ?? "",
    portraitUrl: s.portraitUrl,
    xp: s.xp ?? 0,
    subclass: s.subclass ?? "",
    alignment: s.alignment ?? "",
    size: s.size ?? "Mediano",
    heroicInspiration: s.heroicInspiration ?? false,
    initiativeBonus: s.initiativeBonus ?? 0,
    passivePerception: s.passivePerception,
    hitDiceUsed: s.hitDiceUsed ?? 0,
    attacks: s.attacks ?? [],
    speciesTraits: s.speciesTraits ?? [],
    classFeatures: s.classFeatures ?? s.features ?? [],
    feats: s.feats ?? [],
    languages: s.languages ?? [],
    coins: s.coins ?? emptyCoins(),
    armorTraining: s.armorTraining ?? { light: false, medium: false, heavy: false, shields: false },
    weaponProficiencies: s.weaponProficiencies ?? "",
    toolProficiencies: s.toolProficiencies ?? "",
    spellcastingAbility: s.spellcastingAbility ?? "",
    spellSaveDc: s.spellSaveDc,
    spellAttackBonus: s.spellAttackBonus,
    spellSlots: s.spellSlots ?? {},
    cantrips: s.cantrips ?? [],
    preparedSpells: s.preparedSpells ?? s.spells ?? [],
    appearance: s.appearance ?? "",
    personality: s.personality ?? "",
    backstory: s.backstory ?? "",
    attunedItems: s.attunedItems ?? [],
  };
}

export function toInt(v: string) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

export function clampLevel(v: string) {
  return Math.max(1, Math.min(20, toInt(v) || 1));
}

export function splitLines(v: string) {
  return v.split("\n").map((l) => l.trim()).filter(Boolean);
}

export function splitList(v: string) {
  return v.split(",").map((l) => l.trim()).filter(Boolean);
}

export function fmtMod(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** Notación 1d20 con modificador para el motor de dados. */
export function d20Notation(mod: number) {
  if (mod === 0) return "1d20";
  return mod > 0 ? `1d20+${mod}` : `1d20${mod}`;
}

/** Extrae la primera expresión de dados de un texto (ej. "1d8+3 cortante" → "1d8+3"). */
export function extractDiceNotation(text: string) {
  const m = text.match(/\d+d\d+(?:[+-]\d+)?/i);
  return m ? m[0].toLowerCase() : null;
}

/** Parsea bonificador de ataque "+5" o CD "CD 13". */
export function parseAttackBonus(bonus: string) {
  const dc = bonus.match(/cd\s*(\d+)/i);
  if (dc) return { mod: 0, isDC: true as const, dc: parseInt(dc[1]!, 10) };
  const m = bonus.match(/([+-]?\d+)/);
  if (m) return { mod: parseInt(m[1]!, 10), isDC: false as const };
  return null;
}

export function updateSpellSlot(
  sheet: CharacterSheet,
  lvl: number,
  change: Partial<{ total: number; used: number }>,
): Record<number, { total: number; used: number }> {
  const slots = { ...(sheet.spellSlots ?? {}) };
  const current = slots[lvl] ?? { total: 0, used: 0 };
  slots[lvl] = { ...current, ...change };
  return slots;
}
