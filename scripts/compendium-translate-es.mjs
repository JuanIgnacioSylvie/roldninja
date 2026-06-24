/**
 * OCR repair + PHB compendium EN→ES (phrase-based, avoids spanglish word-swap).
 */

/** Fix common PDF extraction artifacts before translation. */
export function repairOcrText(text) {
  if (!text) return "";
  let t = String(text).replace(/\s+/g, " ");

  t = t.replace(/\bL\s*E\s*V\s*E\s*L\s*(\d+)\s*:/gi, "LEVEL $1:");
  t = t.replace(/\bLEVEL\s*(\d+)\s*:/gi, "LEVEL $1:");
  t = t.replace(/\bLEVEL(\d+):/gi, "LEVEL $1:");

  t = t.replace(/\bO\s+F\s+THE\b/gi, "OF THE");
  t = t.replace(/\bO\s+F\b/gi, "OF");
  t = t.replace(/\bT\s+H\s+E\b/gi, "THE");

  t = t.replace(/\bex\s+tra\b/gi, "extra");
  t = t.replace(/\bSha\s+red\b/gi, "Shared");
  t = t.replace(/\bConjur\s+e\b/gi, "Conjure");
  t = t.replace(/\bProfici\s+ency\b/gi, "Proficiency");
  t = t.replace(/\bBonu\s+s\b/gi, "Bonus");
  t = t.replace(/\bRe\s+action\b/gi, "Reaction");
  t = t.replace(/\bMag\s+ic\b/gi, "Magic");
  t = t.replace(/\bDru\s+id\b/gi, "Druid");
  t = t.replace(/\bWis\s+dom\b/gi, "Wisdom");
  t = t.replace(/\bConstitu\s+tion\b/gi, "Constitution");

  return t.replace(/\s+/g, " ").trim();
}

/** Format level headers and paragraphs for display. */
export function formatCompendiumBody(text, locale = "en") {
  let t = repairOcrText(text);
  t = t.replace(/\bLEVEL\s+(\d+):/gi, locale === "es" ? "\n\nNivel $1:" : "\n\nLevel $1:");
  t = t.replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

const PHRASES_ES = [
  ["Circle of the Moon Spells table", "tabla de conjuros del Círculo de la Luna"],
  ["Circle of the Moon Spells", "conjuros del Círculo de la Luna"],
  ["Temporary Hit Points", "puntos de golpe temporales"],
  ["temporary hit points", "puntos de golpe temporales"],
  ["Challenge Rating", "valor de desafío"],
  ["Prepared Spells", "conjuros preparados"],
  ["spell attack modifier", "modificador de ataque con conjuro"],
  ["spell save DC", "CD de salvación de conjuro"],
  ["Constitution saving throw", "tirada de salvación de Constitución"],
  ["Dexterity saving throw", "tirada de salvación de Destreza"],
  ["Strength saving throw", "tirada de salvación de Fuerza"],
  ["Intelligence saving throw", "tirada de salvación de Inteligencia"],
  ["Wisdom saving throw", "tirada de salvación de Sabiduría"],
  ["Charisma saving throw", "tirada de salvación de Carisma"],
  ["saving throw", "tirada de salvación"],
  ["melee weapon attack", "ataque con arma cuerpo a cuerpo"],
  ["ranged weapon attack", "ataque con arma a distancia"],
  ["melee attack roll", "tirada de ataque cuerpo a cuerpo"],
  ["ranged attack roll", "tirada de ataque a distancia"],
  ["attack roll", "tirada de ataque"],
  ["spell attack", "ataque con conjuro"],
  ["Bonus Action", "acción adicional"],
  ["Magic Action", "acción mágica"],
  ["Long Rest", "descanso largo"],
  ["Short Rest", "descanso corto"],
  ["Wild Shape form", "forma de forma salvaje"],
  ["Wild Shape", "forma salvaje"],
  ["Armor Class", "clase de armadura"],
  ["Hit Points", "puntos de golpe"],
  ["hit points", "puntos de golpe"],
  ["Proficiency Bonus", "bonificador de competencia"],
  ["Heroic Inspiration", "inspiración heroica"],
  ["Radiant damage", "daño radiante"],
  ["Necrotic damage", "daño necrótico"],
  ["once per turn", "una vez por turno"],
  ["once per long rest", "una vez por descanso largo"],
  ["until the end of your next turn", "hasta el final de tu siguiente turno"],
  ["at the start of your turn", "al inicio de tu turno"],
  ["When you reach", "Cuando alcanzas"],
  ["When you take", "Cuando realizas"],
  ["When you hit", "Cuando impactas"],
  ["When you cast", "Cuando lanzas"],
  ["you can", "puedes"],
  ["You can", "Puedes"],
  ["you gain", "ganas"],
  ["You gain", "Ganas"],
  ["you have", "tienes"],
  ["You have", "Tienes"],
  ["your Wisdom modifier", "tu modificador de Sabiduría"],
  ["your Constitution modifier", "tu modificador de Constitución"],
  ["your Dexterity modifier", "tu modificador de Destreza"],
  ["your Strength modifier", "tu modificador de Fuerza"],
  ["your Intelligence modifier", "tu modificador de Inteligencia"],
  ["your Charisma modifier", "tu modificador de Carisma"],
  ["your Proficiency Bonus", "tu bonificador de competencia"],
  ["your Druid level", "tu nivel de druida"],
  ["your level", "tu nivel"],
  ["equal to", "igual a"],
  ["plus your", "más tu"],
  ["rounded down", "redondeado hacia abajo"],
  ["round down", "redondea hacia abajo"],
  ["advantage on", "ventaja en"],
  ["disadvantage on", "desventaja en"],
  ["within 5 feet", "a 1,5 metros"],
  ["within 10 feet", "a 3 metros"],
  ["within 30 feet", "a 9 metros"],
  ["within 60 feet", "a 18 metros"],
  ["5 feet", "1,5 metros"],
  ["10 feet", "3 metros"],
  ["30 feet", "9 metros"],
  ["60 feet", "18 metros"],
  ["On a failed save", "Si falla la tirada de salvación"],
  ["On a successful save", "Si tiene éxito en la tirada de salvación"],
  ["On a failure", "Si falla"],
  ["On a success", "Si tiene éxito"],
  ["On a hit", "Si impacta"],
  ["willing creature", "criatura dispuesta"],
  ["spell slot", "espacio de conjuro"],
  ["spell slots", "espacios de conjuro"],
  ["prepared spells", "conjuros preparados"],
  ["In addition,", "Además,"],
  ["while you're in a", "mientras estás en una"],
  ["until you leave the form", "hasta que abandones la forma"],
  ["if that total is higher than", "si ese total es mayor que"],
  ["divided by", "dividido entre"],
];

PHRASES_ES.sort((a, b) => b[0].length - a[0].length);

export function translateCompendiumBody(text) {
  if (!text) return "";
  let out = formatCompendiumBody(text, "es");
  for (const [en, es] of PHRASES_ES) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, es);
  }
  return out.replace(/\n /g, "\n").trim();
}

export function translateCompendiumSummary(text) {
  if (!text) return "";
  let out = String(text);
  for (const [en, es] of PHRASES_ES) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, es);
  }
  return out.trim();
}
