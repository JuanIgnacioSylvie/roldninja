// Descarga hechizos SRD 5.1 desde Open5e con textos en español (SRD ES vía Jtachan/DnD-5.5-Spells-ES).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { stripHtml, translateSrdText } from "./srd-glossary-es.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "apps", "web", "public");
const outFile = join(outDir, "srd-spells.json");
const namesEs = JSON.parse(readFileSync(join(__dirname, "spell-names-es.json"), "utf8"));

const JTACHAN_SPELLS_URL =
  "https://raw.githubusercontent.com/Jtachan/DnD-5.5-Spells-ES/main/spells/ed5_0/all.json";

const SCHOOLS_ES = {
  Abjuration: "Abjuración",
  Conjuration: "Conjuración",
  Divination: "Adivinación",
  Enchantment: "Encantamiento",
  Evocation: "Evocación",
  Illusion: "Ilusión",
  Necromancy: "Nigromancia",
  Transmutation: "Transmutación",
};

const CLASS_MAP = {
  Bard: "bard",
  Cleric: "cleric",
  Druid: "druid",
  Paladin: "paladin",
  Ranger: "ranger",
  Sorcerer: "sorcerer",
  Warlock: "warlock",
  Wizard: "wizard",
};

const CLASS_LABEL_ES = {
  Bard: "Bardo",
  Cleric: "Clérigo",
  Druid: "Druida",
  Paladin: "Paladín",
  Ranger: "Explorador",
  Sorcerer: "Hechicero",
  Warlock: "Brujo",
  Wizard: "Mago",
};

function parseClasses(dndClass) {
  if (!dndClass) return [];
  return dndClass
    .split(",")
    .map((c) => c.trim())
    .map((c) => CLASS_MAP[c])
    .filter(Boolean);
}

function spellMatchScore(en, es) {
  let score = 0;
  if ((SCHOOLS_ES[en.school] ?? en.school) !== es.escuela) return -1;
  if (Number(en.level_int ?? 0) !== es.nivel) return -1;
  score += 10;
  const enClasses = (en.dnd_class ?? "")
    .split(",")
    .map((c) => CLASS_LABEL_ES[c.trim()] ?? c.trim())
    .filter(Boolean);
  score += enClasses.filter((c) => es.clases.includes(c)).length * 5;
  const enRange = String(en.range ?? "").toLowerCase();
  const esRange = String(Array.isArray(es.alcance) ? es.alcance[0] : es.alcance ?? "").toLowerCase();
  if (enRange.includes("self") && esRange.includes("personal")) score += 3;
  else if (enRange.match(/\d+/)?.[0] && esRange.includes(enRange.match(/\d+/)[0])) score += 3;
  const enDur = String(en.duration ?? "").toLowerCase();
  const esDur = String(es.duracion ?? "").toLowerCase();
  if ((enDur.includes("instant") && esDur.includes("instant")) || enDur === esDur) score += 2;
  const enComp = en.components ?? "";
  const esComp = Array.isArray(es.componentes) ? es.componentes.join(", ") : es.componentes ?? "";
  if (enComp === esComp) score += 2;
  return score;
}

function buildSpanishSpellMap(esSpells) {
  return (enSpell) => {
    let best = null;
    let bestScore = 0;
    for (const es of esSpells) {
      const score = spellMatchScore(enSpell, es);
      if (score > bestScore) {
        bestScore = score;
        best = es;
      }
    }
    return bestScore >= 15 ? best : null;
  };
}

function mapSpell(s, findSpanish) {
  const slug = s.slug;
  const schoolEn = s.school ?? "Evocation";
  const descEn = String(s.desc ?? "").replace(/\s+/g, " ").trim();
  const esMatch = findSpanish(s);
  const descEs = esMatch
    ? stripHtml(Array.isArray(esMatch.descripcion) ? esMatch.descripcion[0] : esMatch.descripcion)
    : translateSrdText(descEn);

  return {
    id: slug,
    nameEn: s.name,
    nameEs: namesEs[slug] ?? esMatch?.nombre ?? s.name,
    level: Number(s.level_int ?? s.level ?? 0),
    schoolEn,
    schoolEs: SCHOOLS_ES[schoolEn] ?? schoolEn,
    castingTimeEn: s.casting_time ?? "1 action",
    castingTimeEs: esMatch?.tiempo_de_lanzamiento
      ? String(esMatch.tiempo_de_lanzamiento).replace("Acción", "1 acción")
      : (s.casting_time ?? "1 action")
          .replace("1 action", "1 acción")
          .replace("1 bonus action", "1 acción adicional")
          .replace("1 reaction", "1 reacción")
          .replace("1 minute", "1 minuto"),
    range: s.range ?? "Self",
    components: s.components ?? "",
    durationEn: s.duration ?? "Instantaneous",
    durationEs: esMatch?.duracion
      ? String(esMatch.duracion)
      : (s.duration ?? "Instantaneous")
          .replace("Instantaneous", "Instantáneo")
          .replace("Concentration", "Concentración"),
    descriptionEn: descEn,
    descriptionEs: descEs,
    classes: parseClasses(s.dnd_class),
  };
}

async function main() {
  process.stdout.write("[spells] Descargando hechizos en español...\n");
  const esRes = await fetch(JTACHAN_SPELLS_URL);
  if (!esRes.ok) throw new Error(`No se pudo descargar hechizos ES (${esRes.status})`);
  const esSpells = await esRes.json();
  const findSpanish = buildSpanishSpellMap(esSpells);

  let url = "https://api.open5e.com/v1/spells/?document__slug=wotc-srd&limit=100";
  const all = [];
  let page = 1;
  while (url) {
    process.stdout.write(`\r[spells] Pagina ${page}... (${all.length} acumulados)`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    for (const s of data.results) all.push(mapSpell(s, findSpanish));
    url = data.next;
    page++;
  }
  all.sort((a, b) => a.level - b.level || a.nameEn.localeCompare(b.nameEn));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(all));
  const withEs = all.filter((s) => s.descriptionEs !== s.descriptionEn).length;
  console.log(`\n[spells] Listo: ${all.length} hechizos (${withEs} con descripción ES) -> ${outFile}`);
}

main().catch((err) => {
  console.error("\n[spells] Error:", err.message);
  process.exit(1);
});
