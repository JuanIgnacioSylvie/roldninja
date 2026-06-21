/**
 * Subconjunto de datos del PHB 2024 (5.5) para el wizard de creacion de personajes.
 * No es exhaustivo: cubre lo necesario para el paso a paso. Ampliable.
 */
import type { Ability } from "../rules/abilities.js";

export interface Species {
  id: string;
  name: string;
  size: "Small" | "Medium";
  speed: number;
  traits: string[];
}

export interface Background {
  id: string;
  name: string;
  abilityScores: Ability[]; // entre las que repartir +2/+1 (o +1/+1/+1)
  originFeat: string;
  skillProficiencies: string[];
  toolProficiency: string;
}

export interface DndClass {
  id: string;
  name: string;
  hitDie: number;
  primaryAbility: Ability[];
  savingThrows: Ability[];
  skillChoices: { choose: number; from: string[] };
  isCaster: boolean;
}

export const SPECIES: Species[] = [
  { id: "human", name: "Humano", size: "Medium", speed: 30, traits: ["Versatil", "Habilidoso (1 competencia)", "Dote de origen extra"] },
  { id: "elf", name: "Elfo", size: "Medium", speed: 30, traits: ["Vision en la oscuridad", "Sentidos agudos", "Linaje feerico", "Trance"] },
  { id: "dwarf", name: "Enano", size: "Medium", speed: 30, traits: ["Vision en la oscuridad", "Resistencia enana (veneno)", "Fortaleza enana", "Sentido de la piedra"] },
  { id: "halfling", name: "Mediano", size: "Small", speed: 30, traits: ["Suerte", "Valiente", "Agilidad mediana", "Sigiloso"] },
  { id: "dragonborn", name: "Draconido", size: "Medium", speed: 30, traits: ["Ancestro draconico", "Arma de aliento", "Resistencia al daño", "Vuelo draconico (nivel 5)"] },
  { id: "gnome", name: "Gnomo", size: "Small", speed: 30, traits: ["Vision en la oscuridad", "Astucia gnoma (salvaciones INT/SAB/CAR)"] },
  { id: "orc", name: "Orco", size: "Medium", speed: 30, traits: ["Vision en la oscuridad", "Embate adrenalinico", "Implacable"] },
  { id: "tiefling", name: "Tiflin", size: "Medium", speed: 30, traits: ["Vision en la oscuridad", "Legado infernal/abisal/ctonico", "Resistencia"] },
  { id: "aasimar", name: "Aasimar", size: "Medium", speed: 30, traits: ["Vision en la oscuridad", "Resistencia radiante/necrotica", "Manos sanadoras", "Revelacion celestial"] },
  { id: "goliath", name: "Goliat", size: "Medium", speed: 35, traits: ["Ascendencia gigante", "Constitucion grande", "Estatura imponente"] },
];

export const BACKGROUNDS: Background[] = [
  { id: "acolyte", name: "Acolito", abilityScores: ["int", "wis", "cha"], originFeat: "Iniciado en Magia (Clerigo)", skillProficiencies: ["Perspicacia", "Religion"], toolProficiency: "Utiles de caligrafia" },
  { id: "artisan", name: "Artesano", abilityScores: ["str", "dex", "int"], originFeat: "Habilidoso", skillProficiencies: ["Investigacion", "Persuasion"], toolProficiency: "Herramientas de artesano" },
  { id: "criminal", name: "Criminal", abilityScores: ["dex", "con", "int"], originFeat: "Alerta", skillProficiencies: ["Juego de manos", "Sigilo"], toolProficiency: "Utiles de ladron" },
  { id: "entertainer", name: "Animador", abilityScores: ["str", "dex", "cha"], originFeat: "Musico", skillProficiencies: ["Acrobacias", "Interpretacion"], toolProficiency: "Instrumento musical" },
  { id: "guard", name: "Guardia", abilityScores: ["str", "int", "wis"], originFeat: "Tirador", skillProficiencies: ["Atletismo", "Percepcion"], toolProficiency: "Herramientas de juego" },
  { id: "hermit", name: "Ermitaño", abilityScores: ["con", "wis", "cha"], originFeat: "Sanador", skillProficiencies: ["Medicina", "Religion"], toolProficiency: "Utiles de herborista" },
  { id: "merchant", name: "Mercader", abilityScores: ["con", "int", "cha"], originFeat: "Afortunado", skillProficiencies: ["Trato con animales", "Persuasion"], toolProficiency: "Herramientas de navegante" },
  { id: "noble", name: "Noble", abilityScores: ["str", "int", "cha"], originFeat: "Habilidoso", skillProficiencies: ["Historia", "Persuasion"], toolProficiency: "Herramientas de juego" },
  { id: "sage", name: "Sabio", abilityScores: ["con", "int", "wis"], originFeat: "Iniciado en Magia (Mago)", skillProficiencies: ["Arcanos", "Historia"], toolProficiency: "Utiles de caligrafia" },
  { id: "soldier", name: "Soldado", abilityScores: ["str", "dex", "con"], originFeat: "Atacante Salvaje", skillProficiencies: ["Atletismo", "Intimidacion"], toolProficiency: "Herramientas de juego" },
];

export const CLASSES: DndClass[] = [
  { id: "barbarian", name: "Barbaro", hitDie: 12, primaryAbility: ["str"], savingThrows: ["str", "con"], skillChoices: { choose: 2, from: ["Trato con animales", "Atletismo", "Intimidacion", "Naturaleza", "Percepcion", "Supervivencia"] }, isCaster: false },
  { id: "bard", name: "Bardo", hitDie: 8, primaryAbility: ["cha"], savingThrows: ["dex", "cha"], skillChoices: { choose: 3, from: ["Cualquiera"] }, isCaster: true },
  { id: "cleric", name: "Clerigo", hitDie: 8, primaryAbility: ["wis"], savingThrows: ["wis", "cha"], skillChoices: { choose: 2, from: ["Historia", "Perspicacia", "Medicina", "Persuasion", "Religion"] }, isCaster: true },
  { id: "druid", name: "Druida", hitDie: 8, primaryAbility: ["wis"], savingThrows: ["int", "wis"], skillChoices: { choose: 2, from: ["Arcanos", "Trato con animales", "Perspicacia", "Medicina", "Naturaleza", "Percepcion", "Religion", "Supervivencia"] }, isCaster: true },
  { id: "fighter", name: "Guerrero", hitDie: 10, primaryAbility: ["str", "dex"], savingThrows: ["str", "con"], skillChoices: { choose: 2, from: ["Acrobacias", "Trato con animales", "Atletismo", "Historia", "Perspicacia", "Intimidacion", "Persuasion", "Percepcion", "Supervivencia"] }, isCaster: false },
  { id: "monk", name: "Monje", hitDie: 8, primaryAbility: ["dex", "wis"], savingThrows: ["str", "dex"], skillChoices: { choose: 2, from: ["Acrobacias", "Atletismo", "Historia", "Perspicacia", "Religion", "Sigilo"] }, isCaster: false },
  { id: "paladin", name: "Paladin", hitDie: 10, primaryAbility: ["str", "cha"], savingThrows: ["wis", "cha"], skillChoices: { choose: 2, from: ["Atletismo", "Perspicacia", "Intimidacion", "Medicina", "Persuasion", "Religion"] }, isCaster: true },
  { id: "ranger", name: "Explorador", hitDie: 10, primaryAbility: ["dex", "wis"], savingThrows: ["str", "dex"], skillChoices: { choose: 3, from: ["Trato con animales", "Atletismo", "Perspicacia", "Investigacion", "Naturaleza", "Percepcion", "Sigilo", "Supervivencia"] }, isCaster: true },
  { id: "rogue", name: "Picaro", hitDie: 8, primaryAbility: ["dex"], savingThrows: ["dex", "int"], skillChoices: { choose: 4, from: ["Acrobacias", "Atletismo", "Engaño", "Perspicacia", "Intimidacion", "Investigacion", "Percepcion", "Interpretacion", "Persuasion", "Juego de manos", "Sigilo"] }, isCaster: false },
  { id: "sorcerer", name: "Hechicero", hitDie: 6, primaryAbility: ["cha"], savingThrows: ["con", "cha"], skillChoices: { choose: 2, from: ["Arcanos", "Engaño", "Perspicacia", "Intimidacion", "Persuasion", "Religion"] }, isCaster: true },
  { id: "warlock", name: "Brujo", hitDie: 8, primaryAbility: ["cha"], savingThrows: ["wis", "cha"], skillChoices: { choose: 2, from: ["Arcanos", "Engaño", "Historia", "Intimidacion", "Investigacion", "Naturaleza", "Religion"] }, isCaster: true },
  { id: "wizard", name: "Mago", hitDie: 6, primaryAbility: ["int"], savingThrows: ["int", "wis"], skillChoices: { choose: 2, from: ["Arcanos", "Historia", "Perspicacia", "Investigacion", "Medicina", "Naturaleza", "Religion"] }, isCaster: true },
];

export const SKILL_TO_ABILITY: Record<string, Ability> = {
  Acrobacias: "dex",
  "Trato con animales": "wis",
  Arcanos: "int",
  Atletismo: "str",
  Engaño: "cha",
  Historia: "int",
  Perspicacia: "wis",
  Intimidacion: "cha",
  Investigacion: "int",
  Medicina: "wis",
  Naturaleza: "int",
  Percepcion: "wis",
  Interpretacion: "cha",
  Persuasion: "cha",
  Religion: "int",
  "Juego de manos": "dex",
  Sigilo: "dex",
  Supervivencia: "wis",
};

export const ALL_SKILLS = Object.keys(SKILL_TO_ABILITY);
