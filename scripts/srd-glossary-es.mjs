/** Traducción heurística de texto SRD EN→ES (términos de juego). */
const REPLACEMENTS = [
  [/can breathe air and water/gi, "puede respirar aire y agua"],
  [/breathe air and water/gi, "respirar aire y agua"],
  [/Constitution saving throw/gi, "tirada de salvación de Constitución"],
  [/Dexterity saving throw/gi, "tirada de salvación de Destreza"],
  [/Strength saving throw/gi, "tirada de salvación de Fuerza"],
  [/Intelligence saving throw/gi, "tirada de salvación de Inteligencia"],
  [/Wisdom saving throw/gi, "tirada de salvación de Sabiduría"],
  [/Charisma saving throw/gi, "tirada de salvación de Carisma"],
  [/saving throw/gi, "tirada de salvación"],
  [/melee attack roll/gi, "tirada de ataque cuerpo a cuerpo"],
  [/ranged attack roll/gi, "tirada de ataque a distancia"],
  [/melee weapon attack/gi, "ataque con arma cuerpo a cuerpo"],
  [/ranged weapon attack/gi, "ataque con arma a distancia"],
  [/melee attack/gi, "ataque cuerpo a cuerpo"],
  [/ranged attack/gi, "ataque a distancia"],
  [/spell attack/gi, "ataque con conjuro"],
  [/attack roll/gi, "tirada de ataque"],
  [/On a failure/gi, "Si falla"],
  [/On a success/gi, "Si tiene éxito"],
  [/On a failed save/gi, "Si falla la tirada de salvación"],
  [/On a successful save/gi, "Si tiene éxito en la tirada de salvación"],
  [/advantage on/gi, "ventaja en"],
  [/disadvantage on/gi, "desventaja en"],
  [/advantage/gi, "ventaja"],
  [/disadvantage/gi, "desventaja"],
  [/hit points/gi, "puntos de golpe"],
  [/darkvision/gi, "visión en la oscuridad"],
  [/passive Perception/gi, "Percepción pasiva"],
  [/recharge on/gi, "recarga en"],
  [/Recharge/gi, "Recarga"],
  [/within (\d+) ft\.?/gi, "a $1 pies"],
  [/(\d+) ft\.?/gi, "$1 pies"],
  [/Constitution/gi, "Constitución"],
  [/Dexterity/gi, "Destreza"],
  [/Strength/gi, "Fuerza"],
  [/Intelligence/gi, "Inteligencia"],
  [/Wisdom/gi, "Sabiduría"],
  [/Charisma/gi, "Carisma"],
  [/The ([\w\s-]+) can/gi, "El $1 puede"],
  [/The ([\w\s-]+) has/gi, "El $1 tiene"],
  [/While underwater/gi, "Bajo el agua"],
  [/If a creature/gi, "Si una criatura"],
  [/If the ([\w\s-]+)/gi, "Si el $1"],
  [/A creature that/gi, "Una criatura que"],
  [/Each target/gi, "Cada objetivo"],
  [/On a hit/gi, "Si impacta"],
  [/Hit:/gi, "Impacto:"],
  [/creature/gi, "criatura"],
  [/creatures/gi, "criaturas"],
  [/damage/gi, "daño"],
  [/target/gi, "objetivo"],
  [/targets/gi, "objetivos"],
  [/while underwater/gi, "bajo el agua"],
  [/underwater/gi, "bajo el agua"],
  [/must make a DC (\d+)/gi, "debe superar una CD $1"],
  [/must succeed on a/gi, "debe tener éxito en una"],
  [/cannot/gi, "no puede"],
  [/until the end of its next turn/gi, "hasta el final de su siguiente turno"],
  [/at the start of its turn/gi, "al inicio de su turno"],
  [/once per turn/gi, "una vez por turno"],
];

const ABILITY_NAMES_ES = {
  Amphibious: "Anfibio",
  Multiattack: "Ataque múltiple",
  Bite: "Mordisco",
  Claw: "Garra",
  Tail: "Cola",
  Tentacle: "Tentáculo",
  "Frightful Presence": "Presencia aterradora",
  "Legendary Resistance": "Resistencia legendaria",
  Spellcasting: "Lanzamiento de conjuros",
  "Pack Tactics": "Tácticas de manada",
  "Keen Sight": "Vista aguda",
  "Keen Hearing": "Oído agudo",
  "Keen Smell": "Olfato agudo",
  "Keen Hearing and Smell": "Oído y olfato agudos",
  "Keen Sight and Smell": "Vista y olfato agudos",
};

export function translateAbilityName(name) {
  const base = name.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const suffix = name.slice(base.length);
  const translated = ABILITY_NAMES_ES[base] ?? ABILITY_NAMES_ES[name] ?? base;
  return translated + suffix;
}

export function translateSrdText(text) {
  if (!text) return "";
  let out = String(text).replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function stripHtml(text) {
  return String(text ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
