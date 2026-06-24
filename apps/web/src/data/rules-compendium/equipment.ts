import { armorPiece, weapon } from "./helpers";

type W = [string, string, string, string, string, string, string];

const WEAPON_DATA: W[] = [
  ["club", "Club", "Garrote", "1d4 Bludgeoning · Light · Slow · 1 SP", "1d4 contundente · Ligera · Ralentizar · 1 PP", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["dagger", "Dagger", "Daga", "1d4 Piercing · Finesse, Light, Thrown (20/60) · Nick · 2 GP", "1d4 perforante · Sutileza, Ligera, Arrojadiza (6/18 m) · Muesca · 2 PO", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["greatclub", "Greatclub", "Gran garrote", "1d8 Bludgeoning · Two-Handed · Push · 2 SP", "1d8 contundente · A dos manos · Empujar · 2 PP", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["handaxe", "Handaxe", "Hacha de mano", "1d6 Slashing · Light, Thrown (20/60) · Vex · 5 GP", "1d6 cortante · Ligera, Arrojadiza (6/18 m) · Vexar · 5 PO", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["javelin", "Javelin", "Jabalina", "1d6 Piercing · Thrown (30/120) · Slow · 5 SP", "1d6 perforante · Arrojadiza (9/36 m) · Ralentizar · 5 PP", "Simple melee/ranged weapon.", "Arma simple arrojadiza."],
  ["light-hammer", "Light Hammer", "Martillo ligero", "1d4 Bludgeoning · Light, Thrown (20/60) · Nick · 2 GP", "1d4 contundente · Ligera, Arrojadiza (6/18 m) · Muesca · 2 PO", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["mace", "Mace", "Maza", "1d6 Bludgeoning · Sap · 5 GP", "1d6 contundente · Aturdir · 5 PO", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["quarterstaff", "Quarterstaff", "Bastón", "1d6 Bludgeoning · Versatile (1d8) · Topple · 2 SP", "1d6 contundente · Versátil (1d8) · Derribar · 2 PP", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["sickle", "Sickle", "Hoz", "1d4 Slashing · Light · Nick · 1 GP", "1d4 cortante · Ligera · Muesca · 1 PO", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["spear", "Spear", "Lanza", "1d6 Piercing · Thrown (20/60), Versatile (1d8) · Sap · 1 GP", "1d6 perforante · Arrojadiza (6/18 m), Versátil (1d8) · Aturdir · 1 PO", "Simple melee weapon.", "Arma simple cuerpo a cuerpo."],
  ["dart", "Dart", "Dardo", "1d4 Piercing · Finesse, Thrown (20/60) · Vex · 5 CP", "1d4 perforante · Sutileza, Arrojadiza (6/18 m) · Vexar · 5 PC", "Simple ranged weapon.", "Arma simple a distancia."],
  ["light-crossbow", "Light Crossbow", "Ballesta ligera", "1d8 Piercing · Ammunition (80/320), Loading, Two-Handed · Slow · 25 GP", "1d8 perforante · Munición (24/96 m), Recarga, A dos manos · Ralentizar · 25 PO", "Simple ranged weapon.", "Arma simple a distancia."],
  ["shortbow", "Shortbow", "Arco corto", "1d6 Piercing · Ammunition (80/320), Two-Handed · Vex · 25 GP", "1d6 perforante · Munición (24/96 m), A dos manos · Vexar · 25 PO", "Simple ranged weapon.", "Arma simple a distancia."],
  ["sling", "Sling", "Honda", "1d4 Bludgeoning · Ammunition (30/120) · Slow · 1 SP", "1d4 contundente · Munición (9/36 m) · Ralentizar · 1 PP", "Simple ranged weapon.", "Arma simple a distancia."],
  ["battleaxe", "Battleaxe", "Hacha de batalla", "1d8 Slashing · Versatile (1d10) · Topple · 10 GP", "1d8 cortante · Versátil (1d10) · Derribar · 10 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["flail", "Flail", "Mayal", "1d8 Bludgeoning · Sap · 10 GP", "1d8 contundente · Aturdir · 10 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["glaive", "Glaive", "Guja", "1d10 Slashing · Heavy, Reach, Two-Handed · Graze · 20 GP", "1d10 cortante · Pesada, Alcance, A dos manos · Rasguñar · 20 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["greataxe", "Greataxe", "Gran hacha", "1d12 Slashing · Heavy, Two-Handed · Cleave · 30 GP", "1d12 cortante · Pesada, A dos manos · Hendir · 30 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["greatsword", "Greatsword", "Espadón", "2d6 Slashing · Heavy, Two-Handed · Graze · 50 GP", "2d6 cortante · Pesada, A dos manos · Rasguñar · 50 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["halberd", "Halberd", "Alabarda", "1d10 Slashing · Heavy, Reach, Two-Handed · Cleave · 20 GP", "1d10 cortante · Pesada, Alcance, A dos manos · Hendir · 20 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["lance", "Lance", "Lanza de caballería", "1d10 Piercing · Heavy, Reach, Two-Handed (unless mounted) · Topple · 10 GP", "1d10 perforante · Pesada, Alcance, A dos manos (montado: una mano) · Derribar · 10 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["longsword", "Longsword", "Espada larga", "1d8 Slashing · Versatile (1d10) · Sap · 15 GP", "1d8 cortante · Versátil (1d10) · Aturdir · 15 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["maul", "Maul", "Mazo grande", "2d6 Bludgeoning · Heavy, Two-Handed · Topple · 10 GP", "2d6 contundente · Pesada, A dos manos · Derribar · 10 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["morningstar", "Morningstar", "Estrella del alba", "1d8 Piercing · Sap · 15 GP", "1d8 perforante · Aturdir · 15 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["pike", "Pike", "Pica", "1d10 Piercing · Heavy, Reach, Two-Handed · Push · 5 GP", "1d10 perforante · Pesada, Alcance, A dos manos · Empujar · 5 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["rapier", "Rapier", "Estoque", "1d8 Piercing · Finesse · Vex · 25 GP", "1d8 perforante · Sutileza · Vexar · 25 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["scimitar", "Scimitar", "Cimitarra", "1d6 Slashing · Finesse, Light · Nick · 25 GP", "1d6 cortante · Sutileza, Ligera · Muesca · 25 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["shortsword", "Shortsword", "Espada corta", "1d6 Piercing · Finesse, Light · Vex · 10 GP", "1d6 perforante · Sutileza, Ligera · Vexar · 10 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["trident", "Trident", "Tridente", "1d8 Piercing · Thrown (20/60), Versatile (1d10) · Topple · 5 GP", "1d8 perforante · Arrojadiza (6/18 m), Versátil (1d10) · Derribar · 5 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["warhammer", "Warhammer", "Martillo de guerra", "1d8 Bludgeoning · Versatile (1d10) · Push · 15 GP", "1d8 contundente · Versátil (1d10) · Empujar · 15 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["war-pick", "War Pick", "Piqueta de guerra", "1d8 Piercing · Versatile (1d10) · Sap · 5 GP", "1d8 perforante · Versátil (1d10) · Aturdir · 5 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["whip", "Whip", "Látigo", "1d4 Slashing · Finesse, Reach · Slow · 2 GP", "1d4 cortante · Sutileza, Alcance · Ralentizar · 2 PO", "Martial melee weapon.", "Arma marcial cuerpo a cuerpo."],
  ["blowgun", "Blowgun", "Cerbatana", "1 Piercing · Ammunition (25/100), Loading · Vex · 10 GP", "1 perforante · Munición (7,5/30 m), Recarga · Vexar · 10 PO", "Martial ranged weapon.", "Arma marcial a distancia."],
  ["hand-crossbow", "Hand Crossbow", "Ballesta de mano", "1d6 Piercing · Ammunition (30/120), Light, Loading · Vex · 75 GP", "1d6 perforante · Munición (9/36 m), Ligera, Recarga · Vexar · 75 PO", "Martial ranged weapon.", "Arma marcial a distancia."],
  ["heavy-crossbow", "Heavy Crossbow", "Ballesta pesada", "1d10 Piercing · Ammunition (100/400), Heavy, Loading, Two-Handed · Push · 50 GP", "1d10 perforante · Munición (30/120 m), Pesada, Recarga, A dos manos · Empujar · 50 PO", "Martial ranged weapon.", "Arma marcial a distancia."],
  ["longbow", "Longbow", "Arco largo", "1d8 Piercing · Ammunition (150/600), Heavy, Two-Handed · Slow · 50 GP", "1d8 perforante · Munición (45/180 m), Pesada, A dos manos · Ralentizar · 50 PO", "Martial ranged weapon.", "Arma marcial a distancia."],
  ["musket", "Musket", "Mosquete", "1d12 Piercing · Ammunition (40/120), Loading, Two-Handed · Slow · 500 GP", "1d12 perforante · Munición (12/36 m), Recarga, A dos manos · Ralentizar · 500 PO", "Martial ranged weapon (firearm).", "Arma de fuego marcial a distancia."],
  ["pistol", "Pistol", "Pistola", "1d10 Piercing · Ammunition (30/90), Loading · Vex · 250 GP", "1d10 perforante · Munición (9/27 m), Recarga · Vexar · 250 PO", "Martial ranged weapon (firearm).", "Arma de fuego marcial a distancia."],
];

type A = [string, string, string, string, string, string, string];

const ARMOR_DATA: A[] = [
  ["padded-armor", "Padded Armor", "Acolchada", "AC 11 + DEX · Stealth Disadvantage · 5 GP", "CA 11 + DES · Desventaja en Sigilo · 5 PO", "Light armor. Don/doff: 1 minute.", "Armadura ligera. Ponerse/quitar: 1 minuto."],
  ["leather-armor", "Leather Armor", "Cuero", "AC 11 + DEX · 10 GP", "CA 11 + DES · 10 PO", "Light armor.", "Armadura ligera."],
  ["studded-leather", "Studded Leather Armor", "Cuero tachonado", "AC 12 + DEX · 45 GP", "CA 12 + DES · 45 PO", "Light armor.", "Armadura ligera."],
  ["hide-armor", "Hide Armor", "Piel", "AC 12 + DEX (max 2) · 10 GP", "CA 12 + DES (máx. 2) · 10 PO", "Medium armor. Don: 5 min, doff: 1 min.", "Armadura media."],
  ["chain-shirt", "Chain Shirt", "Cota de mallas", "AC 13 + DEX (max 2) · 50 GP", "CA 13 + DES (máx. 2) · 50 PO", "Medium armor.", "Armadura media."],
  ["scale-mail", "Scale Mail", "Cota de escamas", "AC 14 + DEX (max 2) · Stealth Disadvantage · 50 GP", "CA 14 + DES (máx. 2) · Desventaja Sigilo · 50 PO", "Medium armor.", "Armadura media."],
  ["breastplate", "Breastplate", "Coraza", "AC 14 + DEX (max 2) · 400 GP", "CA 14 + DES (máx. 2) · 400 PO", "Medium armor.", "Armadura media."],
  ["half-plate", "Half Plate Armor", "Media placa", "AC 15 + DEX (max 2) · Stealth Disadvantage · 750 GP", "CA 15 + DES (máx. 2) · Desventaja Sigilo · 750 PO", "Medium armor.", "Armadura media."],
  ["ring-mail", "Ring Mail", "Cota de anillos", "AC 14 · Stealth Disadvantage · 30 GP", "CA 14 · Desventaja Sigilo · 30 PO", "Heavy armor. Don: 10 min, doff: 5 min.", "Armadura pesada."],
  ["chain-mail", "Chain Mail", "Cota de malla", "AC 16 · STR 13 · Stealth Disadvantage · 75 GP", "CA 16 · FUE 13 · Desventaja Sigilo · 75 PO", "Heavy armor.", "Armadura pesada."],
  ["splint-armor", "Splint Armor", "Armadura de placas", "AC 17 · STR 15 · Stealth Disadvantage · 200 GP", "CA 17 · FUE 15 · Desventaja Sigilo · 200 PO", "Heavy armor.", "Armadura pesada."],
  ["plate-armor", "Plate Armor", "Armadura de placas completa", "AC 18 · STR 15 · Stealth Disadvantage · 1,500 GP", "CA 18 · FUE 15 · Desventaja Sigilo · 1.500 PO", "Heavy armor.", "Armadura pesada."],
  ["shield", "Shield", "Escudo", "AC +2 · 10 GP", "CA +2 · 10 PO", "Shield: Utilize action to don or doff. Requires armor training.", "Escudo: acción Utilizar para ponerse o quitarse. Requiere competencia."],
];

export const WEAPON_ENTRIES = WEAPON_DATA.map(([id, en, es, sumEn, sumEs, bodyEn, bodyEs]) =>
  weapon(id, en, es, sumEn, sumEs, bodyEn, bodyEs),
);

export const ARMOR_ENTRIES = ARMOR_DATA.map(([id, en, es, sumEn, sumEs, bodyEn, bodyEs]) =>
  armorPiece(id, en, es, sumEn, sumEs, bodyEn, bodyEs),
);

export const EQUIPMENT_ENTRIES = [...WEAPON_ENTRIES, ...ARMOR_ENTRIES];
