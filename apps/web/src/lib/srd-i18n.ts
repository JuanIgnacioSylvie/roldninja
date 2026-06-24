import type { Locale } from "@/i18n/es";

/** Hechizo SRD bilingüe (desde srd-spells.json). */
export interface SrdSpell {
  id: string;
  nameEn: string;
  nameEs: string;
  level: number;
  schoolEn: string;
  schoolEs: string;
  castingTimeEn: string;
  castingTimeEs: string;
  range: string;
  components: string;
  durationEn: string;
  durationEs: string;
  descriptionEn: string;
  descriptionEs: string;
  classes: string[];
}

export function spellName(s: SrdSpell, locale: Locale): string {
  return locale === "es" ? s.nameEs : s.nameEn;
}

export function spellSchool(s: SrdSpell, locale: Locale): string {
  return locale === "es" ? s.schoolEs : s.schoolEn;
}

export function spellCastingTime(s: SrdSpell, locale: Locale): string {
  return locale === "es" ? s.castingTimeEs : s.castingTimeEn;
}

export function spellDuration(s: SrdSpell, locale: Locale): string {
  return locale === "es" ? s.durationEs : s.durationEn;
}

export function spellDescription(s: SrdSpell, locale: Locale): string {
  return locale === "es" ? s.descriptionEs : s.descriptionEn;
}

/** Monstruo SRD bilingüe (desde srd-monsters.json). */
export interface SrdMonster {
  id: string;
  nameEn: string;
  nameEs: string;
  size: string;
  type: string;
  cr: string;
  ac: number;
  hp: number;
  hitDice?: string;
  speed: string;
  abilityScores: Record<string, number>;
  saves?: string;
  skills?: string;
  senses?: string;
  languages?: string;
  traits?: { name: string; text: string; nameEs?: string; textEs?: string }[];
  actions?: { name: string; text: string; nameEs?: string; textEs?: string }[];
}

export interface SrdMonsterAbility {
  name: string;
  text: string;
  nameEs?: string;
  textEs?: string;
}

export function monsterAbilityName(entry: SrdMonsterAbility, locale: Locale): string {
  if (locale === "en") return entry.name;
  return entry.nameEs ?? entry.name;
}

export function monsterAbilityText(entry: SrdMonsterAbility, locale: Locale): string {
  if (locale === "en") return entry.text;
  return entry.textEs ?? entry.text;
}

export function monsterName(m: SrdMonster, locale: Locale): string {
  return locale === "es" ? m.nameEs : m.nameEn;
}

const MONSTER_TYPES_ES: Record<string, string> = {
  Aberration: "Aberración",
  Beast: "Bestia",
  Celestial: "Celestial",
  Construct: "Constructo",
  Dragon: "Dragón",
  Elemental: "Elemental",
  Fey: "Feérico",
  Fiend: "Infernal",
  Giant: "Gigante",
  Humanoid: "Humanoide",
  Monstrosity: "Monstruosidad",
  Ooze: "Cieno",
  Plant: "Planta",
  Undead: "No muerto",
};

export function monsterType(m: SrdMonster, locale: Locale): string {
  if (locale === "en") return m.type;
  return MONSTER_TYPES_ES[m.type] ?? m.type;
}

const MONSTER_SIZES_ES: Record<string, string> = {
  Tiny: "Diminuto",
  Small: "Pequeño",
  Medium: "Mediano",
  Large: "Grande",
  Huge: "Enorme",
  Gargantuan: "Gargantuesco",
};

export function monsterSize(m: SrdMonster, locale: Locale): string {
  if (locale === "en") return m.size;
  return MONSTER_SIZES_ES[m.size] ?? m.size;
}

/** Tamaño de criatura SRD → celdas del tablero (D&D 5e). */
export function srdSizeToTokenGrid(size: string): number {
  const map: Record<string, number> = {
    Tiny: 0.5,
    Small: 1,
    Medium: 1,
    Large: 2,
    Huge: 3,
    Gargantuan: 4,
  };
  return map[size] ?? 1;
}

const MANUAL_DRIVE_FILES = {
  phb: {
    es: "1eOfegY3qSYk_7zwjKX6EjQczSlyH4Dlg",
    en: "15vpH28U1h7HaKBD6rY_aWdV52XDilOu1",
  },
  dmg: {
    es: "10w7FeYrVF9c3NEbghs6ozuGcn81tuTno",
    en: "1ziqH__1e270jAaBL64JSna0fP0v1FC5g",
  },
  mm: {
    es: "15vpH28U1h7HaKBD6rY_aWdV52XDilOu1",
    en: "1zyd7HjPvfpEt4M1Jd9YrM3u0-FtO_gMp",
  },
} as const;

export type ManualId = keyof typeof MANUAL_DRIVE_FILES;

function driveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

function driveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function manualDriveOpenUrl(manualId: ManualId, locale: Locale): string {
  return driveViewUrl(MANUAL_DRIVE_FILES[manualId][locale]);
}

export function manualDriveEmbedUrl(manualId: ManualId, locale: Locale): string {
  return driveEmbedUrl(MANUAL_DRIVE_FILES[manualId][locale]);
}

/** @deprecated Usar manualDriveOpenUrl / manualDriveEmbedUrl */
export function manualStaticPath(manualId: ManualId, locale: Locale): string {
  return manualDriveOpenUrl(manualId, locale);
}

export async function resolveManualEmbedUrl(
  manualId: ManualId,
  locale: Locale,
): Promise<string> {
  const stored = getManualUrl(manualId, locale) ?? (locale === "es" ? getManualUrl(manualId, "en") : null);
  if (stored) return stored;
  return manualDriveEmbedUrl(manualId, locale);
}

export async function resolveManualOpenUrl(
  manualId: ManualId,
  locale: Locale,
): Promise<string> {
  const stored = getManualUrl(manualId, locale) ?? (locale === "es" ? getManualUrl(manualId, "en") : null);
  if (stored) return stored;
  return manualDriveOpenUrl(manualId, locale);
}

/** URL para incrustar en iframe (Google Drive preview o PDF subido). */
export async function resolveManualPdfUrl(
  manualId: ManualId,
  locale: Locale,
): Promise<string> {
  return resolveManualEmbedUrl(manualId, locale);
}

const MANUAL_STORAGE_KEY = "roldninja-manual-url";

export function getManualUrl(manualId: string, locale: Locale = "en"): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${MANUAL_STORAGE_KEY}:${manualId}:${locale}`);
}

export function setManualUrl(manualId: string, url: string, locale: Locale = "en") {
  localStorage.setItem(`${MANUAL_STORAGE_KEY}:${manualId}:${locale}`, url);
}
