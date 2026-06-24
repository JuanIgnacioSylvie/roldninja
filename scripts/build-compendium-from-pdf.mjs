/**
 * Extract PHB 2024 feats, subclasses, and equipment from cached PDF text.
 * Usage: node scripts/build-compendium-from-pdf.mjs
 * Prerequisites: scripts/.cache-phb.txt (run probe-pdf.mjs first)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { translateSrdText } from "./srd-glossary-es.mjs";
import { GEAR_CATALOG, gearCostEs } from "./gear-catalog.mjs";
import { GEAR_DESCRIPTIONS } from "./gear-descriptions.mjs";
import {
  formatCompendiumBody,
  translateCompendiumBody,
  translateCompendiumSummary,
} from "./compendium-translate-es.mjs";
import {
  CATEGORY_ES,
  FEAT_NAMES_ES,
  SUBCLASS_NAMES_ES,
  SUBCLASS_TAGLINES_ES,
  SPECIES_NAMES_ES,
  BACKGROUND_NAMES_ES,
  CLASS_NAMES_ES,
} from "./compendium-i18n.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PHB_CACHE = join(__dirname, ".cache-phb.txt");
const OUT_DIR = join(ROOT, "apps/web/src/data/rules-compendium/generated");

const FEAT_TABLE = [
  { name: "Ability Score Improvement", category: "General", repeatable: true },
  { name: "Actor", category: "General" },
  { name: "Alert", category: "Origin" },
  { name: "Archery", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Athlete", category: "General" },
  { name: "Blind Fighting", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Boon of Combat Prowess", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Dimensional Travel", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Energy Resistance", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Fate", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Fortitude", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Irresistible Offense", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Recovery", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Skill", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Speed", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Spell Recall", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of the Night Spirit", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Boon of Truesight", category: "Epic Boon", prerequisite: "Level 19+" },
  { name: "Charger", category: "General" },
  { name: "Chef", category: "General" },
  { name: "Crafter", category: "Origin" },
  { name: "Crossbow Expert", category: "General" },
  { name: "Crusher", category: "General" },
  { name: "Defense", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Defensive Duelist", category: "General" },
  { name: "Dual Wielder", category: "General" },
  { name: "Dueling", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Durable", category: "General" },
  { name: "Elemental Adept", category: "General", repeatable: true },
  { name: "Fey-Touched", category: "General" },
  { name: "Grappler", category: "General", prerequisite: "Level 4+, STR or DEX 13+" },
  { name: "Great Weapon Fighting", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Great Weapon Master", category: "General" },
  { name: "Healer", category: "Origin" },
  { name: "Heavily Armored", category: "General" },
  { name: "Heavy Armor Master", category: "General" },
  { name: "Inspiring Leader", category: "General" },
  { name: "Interception", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Keen Mind", category: "General" },
  { name: "Lightly Armored", category: "General" },
  { name: "Lucky", category: "Origin" },
  { name: "Mage Slayer", category: "General" },
  { name: "Magic Initiate", category: "Origin", repeatable: true },
  { name: "Martial Weapon Training", category: "General" },
  { name: "Medium Armor Master", category: "General" },
  { name: "Moderately Armored", category: "General" },
  { name: "Mounted Combatant", category: "General" },
  { name: "Musician", category: "Origin" },
  { name: "Observant", category: "General" },
  { name: "Piercer", category: "General" },
  { name: "Poisoner", category: "General" },
  { name: "Polearm Master", category: "General" },
  { name: "Protection", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Resilient", category: "General" },
  { name: "Ritual Caster", category: "General" },
  { name: "Savage Attacker", category: "Origin" },
  { name: "Sentinel", category: "General" },
  { name: "Shadow-Touched", category: "General" },
  { name: "Sharpshooter", category: "General" },
  { name: "Shield Master", category: "General" },
  { name: "Skilled", category: "Origin", repeatable: true },
  { name: "Skill Expert", category: "General" },
  { name: "Skulker", category: "General" },
  { name: "Slasher", category: "General" },
  { name: "Speedy", category: "General" },
  { name: "Spell Sniper", category: "General" },
  { name: "Tavern Brawler", category: "General" },
  { name: "Telekinetic", category: "Origin" },
  { name: "Telepathic", category: "General" },
  { name: "Thrown Weapon Fighting", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Tough", category: "Origin" },
  { name: "Two-Weapon Fighting", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "Unarmed Fighting", category: "Fighting Style", prerequisite: "Fighting Style feature" },
  { name: "War Caster", category: "General" },
  { name: "Weapon Master", category: "General" },
];

const SUBCLASS_TABLE = [
  { classId: "barbarian", name: "Path of the Berserker", tagline: "Channel Rage into Violent Fury" },
  { classId: "barbarian", name: "Path of the Wild Heart", tagline: "Walk in Community with the Animal World" },
  { classId: "barbarian", name: "Path of the World Tree", tagline: "Trace the Roots and Branches of the Multiverse" },
  { classId: "barbarian", name: "Path of the Zealot", tagline: "Rage in Ecstatic Union with a God" },
  { classId: "bard", name: "College of Dance", tagline: "Move in Harmony with the Cosmos" },
  { classId: "bard", name: "College of Glamour", tagline: "Weave Beguiling Fey Magic" },
  { classId: "bard", name: "College of Lore", tagline: "Plumb the Depths of Magical Knowledge" },
  { classId: "bard", name: "College of Valor", tagline: "Sing the Deeds of Ancient Heroes" },
  { classId: "cleric", name: "Life Domain", tagline: "Soothe the Hurts of the World" },
  { classId: "cleric", name: "Light Domain", tagline: "Bring Light to Banish Darkness" },
  { classId: "cleric", name: "Trickery Domain", tagline: "Make Mischief and Challenge Authority" },
  { classId: "cleric", name: "War Domain", tagline: "Inspire Valor and Smite Foes" },
  { classId: "druid", name: "Circle of the Land", tagline: "Celebrate Connection to the Natural World" },
  { classId: "druid", name: "Circle of the Moon", tagline: "Adopt Animal Forms to Guard the Wild" },
  { classId: "druid", name: "Circle of the Sea", tagline: "Become One with Tides and Storms" },
  { classId: "druid", name: "Circle of the Stars", tagline: "Harness the Power of the Cosmos" },
  { classId: "fighter", name: "Battle Master", tagline: "Master Sophisticated Battle Maneuvers" },
  { classId: "fighter", name: "Champion", tagline: "Pursue Physical Excellence in Combat" },
  { classId: "fighter", name: "Eldritch Knight", tagline: "Support Combat with Arcane Spells" },
  { classId: "fighter", name: "Psi Warrior", tagline: "Augment Physical Might with Psionic Power" },
  { classId: "monk", name: "Warrior of Mercy", tagline: "Manipulate Forces of Life and Death" },
  { classId: "monk", name: "Warrior of Shadow", tagline: "Harness Shadow for Subterfuge and Ambush" },
  { classId: "monk", name: "Warrior of the Elements", tagline: "Wield Strikes and Bursts of Elemental Power" },
  { classId: "monk", name: "Warrior of the Open Hand", tagline: "Master Unarmed Combat Techniques" },
  { classId: "paladin", name: "Oath of Devotion", tagline: "Uphold the Ideals of Justice and Order" },
  { classId: "paladin", name: "Oath of Glory", tagline: "Strive for the Heights of Heroism" },
  { classId: "paladin", name: "Oath of the Ancients", tagline: "Preserve Life and the Light" },
  { classId: "paladin", name: "Oath of Vengeance", tagline: "Punish Evil Doers at Any Cost" },
  { classId: "ranger", name: "Beast Master", tagline: "Bond with a Primal Beast" },
  { classId: "ranger", name: "Fey Wanderer", tagline: "Wander the Border of the Feywild" },
  { classId: "ranger", name: "Gloom Stalker", tagline: "Draw on Shadow Magic to Fight Your Foes" },
  { classId: "ranger", name: "Hunter", tagline: "Protect Nature with Martial Skill" },
  { classId: "rogue", name: "Arcane Trickster", tagline: "Enhance Stealth with Arcane Spells" },
  { classId: "rogue", name: "Assassin", tagline: "Practice the Grim Art of Death" },
  { classId: "rogue", name: "Soulknife", tagline: "Strike Foes with Psionic Blades" },
  { classId: "rogue", name: "Thief", tagline: "Hunt for Treasure as a Classic Adventurer" },
  { classId: "sorcerer", name: "Aberrant Sorcery", tagline: "Wield Unnatural Psionic Power" },
  { classId: "sorcerer", name: "Clockwork Sorcery", tagline: "Channel Cosmic Forces of Order" },
  { classId: "sorcerer", name: "Draconic Sorcery", tagline: "Breathe the Magic of Dragons" },
  { classId: "sorcerer", name: "Wild Magic Sorcery", tagline: "Unleash Chaotic Magical Energy" },
  { classId: "warlock", name: "Archfey Patron", tagline: "Bargain with Whimsical Fey" },
  { classId: "warlock", name: "Celestial Patron", tagline: "Call on the Power of the Heavens" },
  { classId: "warlock", name: "Fiend Patron", tagline: "Make a Deal with the Lower Planes" },
  { classId: "warlock", name: "Great Old One Patron", tagline: "Unearth Forbidden Lore" },
  { classId: "wizard", name: "Abjurer", tagline: "Shield Companions and Banish Foes" },
  { classId: "wizard", name: "Diviner", tagline: "Learn the Secrets of the Future" },
  { classId: "wizard", name: "Evoker", tagline: "Create Explosive Elemental Effects" },
  { classId: "wizard", name: "Illusionist", tagline: "Weave Subtle Spells of Deception" },
];

const SPECIES_TABLE = [
  "Aasimar",
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Goliath",
  "Halfling",
  "Human",
  "Orc",
  "Tiefling",
];

const SPECIES_TRAITS_PATTERNS = {
  Gnome: /\bG\s*N\s*O\s*M\s*E\s+TRAITS\b/i,
  Goliath: /\bG\s*O\s*L\s*I\s*A\s*T\s*H\s+TRAITS\b/i,
  Orc: /\b(?:O\s*R\s*C|O\s*R\s*E)\s+TRAITS\b|As an?\s+O\s*r\s*e,?\s+you have these special traits/i,
};

const BACKGROUND_TABLE = [
  { name: "Acolyte", skills: ["Insight", "Religion"], feat: "Magic Initiate", featHint: "Cleric" },
  { name: "Artisan", skills: ["Investigation", "Persuasion"], feat: "Crafter" },
  { name: "Charlatan", skills: ["Deception", "Sleight"], feat: "Skilled" },
  { name: "Criminal", skills: ["Stealth", "Thieves"], feat: "Alert" },
  { name: "Entertainer", skills: ["Acrobatics", "Performance"], feat: "Musician" },
  { name: "Farmer", skills: ["Animal Handling", "Nature"], feat: "Tough" },
  { name: "Guard", skills: ["Athletics", "Perception"], feat: "Alert" },
  { name: "Guide", skills: ["Stealth", "Survival"], feat: "Magic Initiate", featHint: "Druid" },
  { name: "Hermit", skills: ["Medicine", "Religion"], feat: "Healer" },
  { name: "Merchant", skills: ["Animal Handling", "Persuasion"], feat: "Lucky" },
  { name: "Noble", skills: ["History", "Persuasion"], feat: "Skilled" },
  { name: "Sage", skills: ["Arcana", "History"], feat: "Magic Initiate", featHint: "Wizard" },
  { name: "Sailor", skills: ["Acrobatics", "Perception"], feat: "Tavern Brawler" },
  { name: "Scribe", skills: ["Investigation", "Perception"], feat: "Skilled" },
  { name: "Soldier", skills: ["Athletics", "Intimidation"], feat: "Savage Attacker" },
  { name: "Wayfarer", skills: ["Insight", "Stealth"], feat: "Lucky" },
];

const CLASS_TABLE = [
  { id: "barbarian", name: "Barbarian" },
  { id: "bard", name: "Bard" },
  { id: "cleric", name: "Cleric" },
  { id: "druid", name: "Druid" },
  { id: "fighter", name: "Fighter" },
  { id: "monk", name: "Monk" },
  { id: "paladin", name: "Paladin" },
  { id: "ranger", name: "Ranger" },
  { id: "rogue", name: "Rogue" },
  { id: "sorcerer", name: "Sorcerer" },
  { id: "warlock", name: "Warlock" },
  { id: "wizard", name: "Wizard" },
];

const CLASS_START_PATTERNS = {
  Cleric: /\bC\s*L\s*E\s*R\s*I\s*C\s+CLASS\b/i,
  Druid: /\bDRUID\s+CLASS\s+FEATURES\b/i,
};

function normalize(text) {
  return text
    .replace(/\r/g, "")
    .replace(/([a-z])-\s*\n\s*([a-z])/gi, "$1$2")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function flexibleName(name) {
  return name
    .split(/\s+/)
    .map((w) => escapeRegex(w))
    .join("\\s+");
}

function cleanBody(raw) {
  return raw
    .replace(/CHAPTER\s+\d+\s+I\s+[\w\s]+/gi, "")
    .replace(/\d{2,3}\s+CHAPTER\s+\d+/gi, "")
    .replace(/You gain the following benefits\.?\s*/gi, "")
    .replace(/These feats are in the \w+(?:\s+\w+)? category\.?\s*/gi, "")
    .replace(/\*This feat can be taken more than once\.\s*/gi, "")
    .replace(/Page \d+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatBody(text) {
  return formatCompendiumBody(cleanBody(text), "en");
}

function tsString(s) {
  return JSON.stringify(s);
}

const FEAT_ALT_PATTERNS = {
  "Blind Fighting": /BLIND\s+(?:\S+\s+){0,6}Fighting\s+Style\s+Feat/i,
  Healer: /HEALER\s+(?:\S+\s+){0,15}Feat/i,
  "Magic Initiate": /MAGIC\s+INITI\s*A\s*TE\s+(?:\S+\s+){0,8}(?:O\s*r\s*i\s*g\s*i\s*n|Origin)\s+(?:F\s*e\s*a\s*t|Feat)/i,
  Telepathic: /T\s*E\s*L\s*E\s*P\s*A\s*T\s*H\s*I\s*C\s+(?:G\s*e\s*n\s*e\s*r\s*a\s*l|General)\s+(?:F\s*e\s*a\s*t|Feat)/i,
  "Boon of Irresistible Offense": /BOON\s+OF\s+(?:\S+\s+){0,5}OFFENSE\s+Epic\s+Boon\s+Feat/i,
};

const SUBCLASS_NAME_PATTERNS = {
  Soulknife: /Sou\W*\s*l\s*K\s*n\s*i\s*f\s*e/i,
  Thief: /THI\s*E\s*F\b/i,
  Illusionist: /ILLUSI/i,
};

function looseKey(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function looseIncludes(haystack, needle, minLen = 12) {
  const h = looseKey(haystack);
  const n = looseKey(needle);
  const probe = n.slice(0, Math.max(minLen, Math.min(n.length, 24)));
  return probe.length >= minLen && h.includes(probe);
}

function featCategoryPattern() {
  return "(?:O\\s*r\\s*i\\s*g\\s*i\\s*n|G\\s*e\\s*n\\s*e\\s*r\\s*a\\s*l|Fighting Style|Epic Boon)";
}

function flexWord(word) {
  return word
    .split("")
    .map((c) => escapeRegex(c))
    .join("\\s*");
}

function flexFeatName(name) {
  return name
    .split(/\s+/)
    .map((w) => flexWord(w.replace(/\*/g, "")))
    .join("\\s+");
}

function pickFeatMatch(section, re) {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const rg = new RegExp(re.source, flags);
  const matches = [...section.matchAll(rg)];
  if (!matches.length) return null;
  const rich = matches.find((m) => /You gain|Increase one ability|Two Cantrips|Repeatable/i.test(section.slice(m.index, m.index + 400)));
  return rich ?? matches[0];
}

function findFeatPositions(norm) {
  const start = norm.search(/ORIGIN FEATS/i);
  const relEnd = norm.slice(start).search(/CHAPTER\s+6\s+I\s+EQUIPMENT/i);
  if (start < 0 || relEnd < 0) throw new Error("Could not locate Chapter 5 feats in PHB text");
  const absEnd = start + relEnd;
  const section = norm.slice(start, absEnd);
  const positions = [];
  const sortedFeats = [...FEAT_TABLE].sort((a, b) => b.name.length - a.name.length);

  for (const feat of sortedFeats) {
    const alt = FEAT_ALT_PATTERNS[feat.name];
    const re = alt
      ? alt
      : new RegExp(
          `${flexFeatName(feat.name)}\\s+${featCategoryPattern()}\\s+Feat(?:\\s*\\([^)]*\\))?`,
          "i",
        );
    const m = pickFeatMatch(section, re);
    if (!m) {
      console.warn("Feat not found:", feat.name);
      continue;
    }
    positions.push({
      feat,
      absStart: start + m.index + m[0].length,
      headerLen: m[0].length,
      matchIndex: start + m.index,
    });
  }

  positions.sort((a, b) => a.absStart - b.absStart);
  return { positions, end: absEnd };
}

function extractFeats(norm) {
  const { positions, end } = findFeatPositions(norm);
  const feats = [];

  for (let i = 0; i < positions.length; i++) {
    const { feat, absStart } = positions[i];
    let absEnd = end;
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[j].matchIndex > absStart) {
        absEnd = positions[j].matchIndex;
        break;
      }
    }
    const raw = norm.slice(absStart, absEnd);
    const bodyEn = formatBody(raw);
    if (bodyEn.length < 20) {
      console.warn("Short body for feat:", feat.name, bodyEn.length);
      continue;
    }
    const titleEs = FEAT_NAMES_ES[feat.name] ?? feat.name;
    const categoryEs = CATEGORY_ES[feat.category] ?? feat.category;
    const bodyEs = translateCompendiumBody(bodyEn);
    const id = slugify(feat.name);
    feats.push({
      id,
      titleEn: feat.name,
      titleEs,
      categoryEn: feat.category,
      categoryEs,
      bodyEn,
      bodyEs,
      prerequisiteEn: feat.prerequisite,
      prerequisiteEs: feat.prerequisite ? translateSrdText(feat.prerequisite) : undefined,
      repeatable: feat.repeatable ?? false,
    });
  }
  return feats;
}

function findPatternMatches(norm, pattern) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const re = new RegExp(pattern.source, flags);
  const hits = [];
  for (const m of norm.matchAll(re)) hits.push(m.index);
  return hits;
}

function findSubclassStart(norm, sub) {
  const patterns = [];
  if (SUBCLASS_NAME_PATTERNS[sub.name]) {
    patterns.push(SUBCLASS_NAME_PATTERNS[sub.name]);
  }
  patterns.push(new RegExp(flexFeatName(sub.name), "i"));

  const candidates = [];
  for (const pattern of patterns) {
    for (const index of findPatternMatches(norm, pattern)) {
      const after = norm.slice(index, index + 60);
      if (/subclasses?\s+(are|is)\s+detailed/i.test(after)) continue;
      if (/,?\s+and\s+$/i.test(norm.slice(Math.max(0, index - 30), index))) continue;
      candidates.push(index);
    }
  }

  const unique = [...new Set(candidates)].sort((a, b) => a - b);
  for (const idx of unique) {
    const window = norm.slice(idx, idx + 700);
    if (looseIncludes(window, sub.tagline, 10)) return idx;
  }
  for (const idx of unique) {
    const window = norm.slice(idx, idx + 1500);
    if (findSubclassBodyStart(norm, idx) >= 0) return idx;
  }
  return unique[unique.length - 1] ?? -1;
}

function findSubclassBodyStart(norm, idx) {
  const slice = norm.slice(idx);
  const re =
    /L\s*E\s*V\s*E\s*L\s+3\s*:\s*(?!(?:BARBARIAN|BARD|CLERIC|DRUID|FIGHTER|MONK|PALADIN|RANGER|ROGUE|SORCERER|WARLOCK|WIZARD)\s+SUBCLASS\b)/i;
  const m = slice.match(re);
  return m ? idx + m.index : -1;
}

function extractSubclasses(norm) {
  const subclasses = [];

  for (const sub of SUBCLASS_TABLE) {
    const idx = findSubclassStart(norm, sub);
    if (idx < 0) {
      console.warn("Subclass not found:", sub.name);
      continue;
    }
    const start = findSubclassBodyStart(norm, idx);
    if (start < 0) {
      console.warn("No level 3 features for:", sub.name);
      continue;
    }

    let end = norm.length;
    for (const other of SUBCLASS_TABLE) {
      if (other.name === sub.name) continue;
      const otherIdx = findSubclassStart(norm, other);
      if (otherIdx > start && otherIdx < end) end = otherIdx;
    }
    const nextSection = norm.slice(start).search(
      /\b(?:FIGHTER|MONK|PALADIN|RANGER|ROGUE|SORCERER|WARLOCK|WIZARD|BARBARIAN|BARD|CLERIC|DRUID)\s+SUBCLASSES\b/i,
    );
    if (nextSection > 0 && start + nextSection < end) end = start + nextSection;

    const bodyEn = formatBody(norm.slice(start, end));
    if (bodyEn.length < 80) {
      console.warn("Short body for subclass:", sub.name, bodyEn.length);
      continue;
    }
    const titleEs = SUBCLASS_NAMES_ES[sub.name] ?? sub.name;
    subclasses.push({
      id: slugify(sub.name),
      classId: sub.classId,
      titleEn: sub.name,
      titleEs,
      taglineEn: sub.tagline,
      taglineEs: SUBCLASS_TAGLINES_ES[sub.tagline] ?? translateCompendiumSummary(sub.tagline),
      bodyEn,
      bodyEs: translateCompendiumBody(bodyEn),
    });
  }

  subclasses.sort((a, b) => a.titleEn.localeCompare(b.titleEn));
  return subclasses;
}

function extractAdventuringGear() {
  return GEAR_CATALOG.map((item) => {
    const desc = GEAR_DESCRIPTIONS[item.id];
    const bodyEn = desc?.en ?? `Adventuring gear item. Cost: ${item.cost}.`;
    const bodyEs = desc?.es ?? `Objeto de equipo de aventura. Coste: ${gearCostEs(item.cost)}.`;
    return {
      id: `gear-${item.id}`,
      nameEn: item.nameEn,
      nameEs: item.nameEs,
      costEn: item.cost,
      costEs: gearCostEs(item.cost),
      bodyEn,
      bodyEs,
    };
  });
}

function findSpeciesTraitsStart(section, name) {
  const alt = SPECIES_TRAITS_PATTERNS[name];
  if (alt) {
    const m = section.match(alt);
    if (m) return m.index;
  }
  const re = new RegExp(`${flexFeatName(name)}\\s+TRAITS`, "i");
  const m = section.match(re);
  return m ? m.index : -1;
}

function extractSpecies(norm) {
  const start = norm.search(/SPECIES DESCRIPTIONS/i);
  const end = norm.search(/ORIGIN FEATS/i);
  if (start < 0 || end < 0) return [];
  const section = norm.slice(start, end);
  const species = [];

  for (const name of SPECIES_TABLE) {
    const idx = findSpeciesTraitsStart(section, name);
    if (idx < 0) {
      console.warn("Species not found:", name);
      continue;
    }
    let endIdx = section.length;
    for (const other of SPECIES_TABLE) {
      if (other === name) continue;
      const otherIdx = findSpeciesTraitsStart(section, other);
      if (otherIdx > idx && otherIdx < endIdx) endIdx = otherIdx;
    }
    const bodyEn = formatBody(section.slice(idx, endIdx));
    if (bodyEn.length < 60) {
      console.warn("Short body for species:", name, bodyEn.length);
      continue;
    }
    const titleEs = SPECIES_NAMES_ES[name] ?? name;
    const summaryEn = bodyEn.slice(0, 120).replace(/\s+/g, " ").trim() + "…";
    species.push({
      id: slugify(name),
      titleEn: name,
      titleEs,
      summaryEn,
      summaryEs: translateCompendiumSummary(summaryEn),
      bodyEn,
      bodyEs: translateCompendiumBody(bodyEn),
    });
  }
  return species;
}

function backgroundChunkMatches(chunk, bg) {
  const loose = looseKey(chunk);
  const skillsOk = bg.skills.every((s) => loose.includes(looseKey(s)));
  const featOk = loose.includes(looseKey(bg.feat));
  if (bg.featHint) {
    return skillsOk && featOk && loose.includes(looseKey(bg.featHint));
  }
  return skillsOk && featOk;
}

function extractBackgrounds(norm) {
  const start = norm.search(/Sixteen backgrounds are presented/i);
  const end = norm.search(/SPECIES DESCRIPTIONS/i);
  if (start < 0 || end < 0) return [];
  const section = norm.slice(start, end);
  const blocks = [...section.matchAll(/Ability Scores:/gi)];
  const backgrounds = [];
  const used = new Set();

  for (let i = 0; i < blocks.length; i++) {
    const chunkStart = blocks[i].index;
    const chunkEnd = blocks[i + 1]?.index ?? section.length;
    const chunk = section.slice(chunkStart, chunkEnd);
    const match = BACKGROUND_TABLE.find((bg) => !used.has(bg.name) && backgroundChunkMatches(chunk, bg));
    if (!match) {
      console.warn("Unmatched background block", i);
      continue;
    }
    used.add(match.name);
    const bodyEn = formatBody(chunk);
    const titleEs = BACKGROUND_NAMES_ES[match.name] ?? match.name;
    backgrounds.push({
      id: slugify(match.name),
      titleEn: match.name,
      titleEs,
      summaryEn: `${match.feat} · ${match.skills.join(", ")}`,
      summaryEs: translateCompendiumSummary(`${match.feat} · ${match.skills.join(", ")}`),
      bodyEn,
      bodyEs: translateCompendiumBody(bodyEn),
    });
  }

  for (const bg of BACKGROUND_TABLE) {
    if (!used.has(bg.name)) console.warn("Background not extracted:", bg.name);
  }

  backgrounds.sort((a, b) => a.titleEn.localeCompare(b.titleEn));
  return backgrounds;
}

function findClassStart(norm, cls) {
  const alt = CLASS_START_PATTERNS[cls.name];
  if (alt) {
    const m = norm.match(alt);
    if (m) return m.index;
  }
  const re = new RegExp(`${flexFeatName(cls.name)}\\s+CLASS\\s+FEATURES`, "i");
  const m = norm.match(re);
  return m ? m.index : -1;
}

function extractClasses(norm) {
  const classes = [];
  const positions = CLASS_TABLE.map((cls) => ({ cls, idx: findClassStart(norm, cls) }))
    .filter((p) => p.idx >= 0)
    .sort((a, b) => a.idx - b.idx);

  for (let i = 0; i < positions.length; i++) {
    const { cls, idx } = positions[i];
    const end = positions[i + 1]?.idx ?? norm.length;
    let slice = norm.slice(idx, end);
    const subIdx = slice.search(/\bSUBCLASSES\b/i);
    if (subIdx > 0) slice = slice.slice(0, subIdx);
    const bodyEn = formatBody(slice);
    if (bodyEn.length < 120) {
      console.warn("Short body for class:", cls.name, bodyEn.length);
      continue;
    }
    const titleEs = CLASS_NAMES_ES[cls.id] ?? cls.name;
    classes.push({
      id: cls.id,
      titleEn: cls.name,
      titleEs,
      summaryEn: `Class features · ${cls.name}`,
      summaryEs: `Habilidades de clase · ${titleEs}`,
      bodyEn,
      bodyEs: translateCompendiumBody(bodyEn),
    });
  }

  for (const cls of CLASS_TABLE) {
    if (!classes.some((c) => c.id === cls.id)) console.warn("Class not extracted:", cls.name);
  }

  return classes;
}

function emitSpeciesTs(items) {
  const lines = items.map(
    (s) =>
      `  entry(${tsString(s.id)}, "species", "species", ${tsString(s.titleEn)}, ${tsString(s.titleEs)}, ${tsString(s.summaryEn)}, ${tsString(s.summaryEs)}, ${tsString(s.bodyEn)}, ${tsString(s.bodyEs)}),`,
  );
  return emitCompendiumModule("PHB_SPECIES_ENTRIES", lines);
}

function emitBackgroundsTs(items) {
  const lines = items.map(
    (b) =>
      `  entry(${tsString(b.id)}, "background", "backgrounds", ${tsString(b.titleEn)}, ${tsString(b.titleEs)}, ${tsString(b.summaryEn)}, ${tsString(b.summaryEs)}, ${tsString(b.bodyEn)}, ${tsString(b.bodyEs)}),`,
  );
  return emitCompendiumModule("PHB_BACKGROUND_ENTRIES", lines);
}

function emitClassesTs(items) {
  const lines = items.map(
    (c) =>
      `  entry(${tsString(c.id)}, "class", "classes", ${tsString(c.titleEn)}, ${tsString(c.titleEs)}, ${tsString(c.summaryEn)}, ${tsString(c.summaryEs)}, ${tsString(c.bodyEn)}, ${tsString(c.bodyEs)}, ${tsString(c.id)}),`,
  );
  return `/** Auto-generated from PHB 2024 PDF — do not edit by hand */\nimport { r } from "../helpers";\n\nfunction entry(\n  id: string,\n  kind: "class",\n  category: string,\n  titleEn: string,\n  titleEs: string,\n  summaryEn: string,\n  summaryEs: string,\n  bodyEn: string,\n  bodyEs: string,\n  classId: string,\n) {\n  return r({\n    id,\n    kind,\n    category,\n    classId,\n    titleEn,\n    titleEs,\n    summaryEn,\n    summaryEs,\n    bodyEn,\n    bodyEs,\n    tags: ["class", classId, titleEn.toLowerCase(), "pdf-generated"],\n    manual: "phb",\n  });\n}\n\nexport const PHB_CLASS_ENTRIES = [\n${lines.join("\n")}\n];\n`;
}

function emitCompendiumModule(exportName, lines) {
  return `/** Auto-generated from PHB 2024 PDF — do not edit by hand */\nimport { r } from "../helpers";\n\nfunction entry(\n  id: string,\n  kind: "species" | "background",\n  category: string,\n  titleEn: string,\n  titleEs: string,\n  summaryEn: string,\n  summaryEs: string,\n  bodyEn: string,\n  bodyEs: string,\n) {\n  return r({\n    id,\n    kind,\n    category,\n    titleEn,\n    titleEs,\n    summaryEn,\n    summaryEs,\n    bodyEn,\n    bodyEs,\n    tags: [kind, titleEn.toLowerCase(), titleEs.toLowerCase(), "pdf-generated"],\n    manual: "phb",\n  });\n}\n\nexport const ${exportName} = [\n${lines.join("\n")}\n];\n`;
}

function emitFeatsTs(feats) {
  const lines = feats.map((f) => {
    const opts = [];
    if (f.prerequisiteEn) opts.push(`prerequisiteEn: ${tsString(f.prerequisiteEn)}`);
    if (f.prerequisiteEs) opts.push(`prerequisiteEs: ${tsString(f.prerequisiteEs)}`);
    if (f.repeatable) opts.push(`repeatable: true`);
    const optsStr = opts.length ? `, { ${opts.join(", ")} }` : "";
    return `  feat(${tsString(f.id)}, ${tsString(f.titleEn)}, ${tsString(f.titleEs)}, ${tsString(f.categoryEn)}, ${tsString(f.categoryEs)}, ${tsString(f.bodyEn)}, ${tsString(f.bodyEs)}${optsStr}),`;
  });
  return `/** Auto-generated from PHB 2024 PDF — do not edit by hand */\nimport { r } from "../helpers";\n\nfunction feat(\n  id: string,\n  titleEn: string,\n  titleEs: string,\n  categoryEn: string,\n  categoryEs: string,\n  bodyEn: string,\n  bodyEs: string,\n  opts?: { prerequisiteEn?: string; prerequisiteEs?: string; repeatable?: boolean },\n) {\n  return r({\n    id,\n    kind: "feat",\n    category: "feats",\n    titleEn,\n    titleEs,\n    summaryEn: \`\${categoryEn}\${opts?.prerequisiteEn ? \` · \${opts.prerequisiteEn}\` : ""}\`,\n    summaryEs: \`\${categoryEs}\${opts?.prerequisiteEs ? \` · \${opts.prerequisiteEs}\` : ""}\`,\n    bodyEn,\n    bodyEs,\n    featCategoryEn: categoryEn,\n    featCategoryEs: categoryEs,\n    prerequisiteEn: opts?.prerequisiteEn,\n    prerequisiteEs: opts?.prerequisiteEs,\n    repeatable: opts?.repeatable,\n    tags: ["feat", categoryEn.toLowerCase(), titleEn.toLowerCase(), titleEs.toLowerCase(), "pdf-generated"],\n    manual: "phb",\n  });\n}\n\nexport const PHB_FEAT_ENTRIES = [\n${lines.join("\n")}\n];\n`;
}

function emitSubclassesTs(subs) {
  const lines = subs.map(
    (s) =>
      `  subclass(${tsString(s.id)}, ${tsString(s.classId)}, ${tsString(s.titleEn)}, ${tsString(s.titleEs)}, ${tsString(s.taglineEn)}, ${tsString(s.taglineEs)}, ${tsString(s.bodyEn)}, ${tsString(s.bodyEs)}),`,
  );
  return `/** Auto-generated from PHB 2024 PDF — do not edit by hand */\nimport { r } from "../helpers";\n\nfunction subclass(\n  id: string,\n  classId: string,\n  titleEn: string,\n  titleEs: string,\n  taglineEn: string,\n  taglineEs: string,\n  bodyEn: string,\n  bodyEs: string,\n) {\n  return r({\n    id,\n    kind: "subclass",\n    category: "subclasses",\n    classId,\n    titleEn,\n    titleEs,\n    summaryEn: taglineEn,\n    summaryEs: taglineEs,\n    bodyEn,\n    bodyEs,\n    tags: ["subclass", classId, titleEn.toLowerCase(), "pdf-generated"],\n    manual: "phb",\n  });\n}\n\nexport const PHB_SUBCLASS_ENTRIES = [\n${lines.join("\n")}\n];\n`;
}

function emitGearTs(items) {
  const lines = items.map(
    (g) =>
      `  gear(${tsString(g.id)}, ${tsString(g.nameEn)}, ${tsString(g.nameEs)}, ${tsString(g.costEn)}, ${tsString(g.costEs)}, ${tsString(g.bodyEn)}, ${tsString(g.bodyEs)}),`,
  );
  return `/** Auto-generated from PHB 2024 — do not edit by hand */\nimport { r } from "../helpers";\n\nfunction gear(id: string, titleEn: string, titleEs: string, costEn: string, costEs: string, bodyEn: string, bodyEs: string) {\n  return r({\n    id,\n    kind: "equipment",\n    category: "equipment",\n    titleEn,\n    titleEs,\n    summaryEn: costEn,\n    summaryEs: costEs,\n    bodyEn,\n    bodyEs,\n    tags: ["equipment", "adventuring gear", titleEn.toLowerCase()],\n    manual: "phb",\n  });\n}\n\nexport const PHB_GEAR_ENTRIES = [\n${lines.join("\n")}\n];\n`;
}

function main() {
  if (!existsSync(PHB_CACHE)) {
    console.error("Missing", PHB_CACHE, "— run: node scripts/probe-pdf.mjs <phb.pdf> scripts/.cache-phb.txt");
    process.exit(1);
  }
  const raw = readFileSync(PHB_CACHE, "utf8");
  const norm = normalize(raw);
  console.log("Normalized PHB:", norm.length, "chars");

  const feats = extractFeats(norm);
  const subclasses = extractSubclasses(norm);
  const gear = extractAdventuringGear();
  const species = extractSpecies(norm);
  const backgrounds = extractBackgrounds(norm);
  const classes = extractClasses(norm);

  console.log(
    `Extracted: ${feats.length} feats, ${subclasses.length} subclasses, ${gear.length} gear, ${species.length} species, ${backgrounds.length} backgrounds, ${classes.length} classes`,
  );

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "phb-feats.ts"), emitFeatsTs(feats), "utf8");
  writeFileSync(join(OUT_DIR, "phb-subclasses.ts"), emitSubclassesTs(subclasses), "utf8");
  writeFileSync(join(OUT_DIR, "phb-gear.ts"), emitGearTs(gear), "utf8");
  writeFileSync(join(OUT_DIR, "phb-species.ts"), emitSpeciesTs(species), "utf8");
  writeFileSync(join(OUT_DIR, "phb-backgrounds.ts"), emitBackgroundsTs(backgrounds), "utf8");
  writeFileSync(join(OUT_DIR, "phb-classes.ts"), emitClassesTs(classes), "utf8");
  console.log("Wrote generated files to", OUT_DIR);
}

main();
