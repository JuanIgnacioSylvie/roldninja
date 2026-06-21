// Descarga el bestiario SRD 5.1 (contenido abierto, CC-BY) desde la API de Open5e
// y lo mapea a nuestro formato Monster, guardandolo en apps/web/public/srd-monsters.json.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { translateAbilityName, translateSrdText } from "./srd-glossary-es.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "apps", "web", "public");
const outFile = join(outDir, "srd-monsters.json");
const namesEs = JSON.parse(readFileSync(join(__dirname, "monster-names-es.json"), "utf8"));

const ABIL = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

function speedToString(speed) {
  if (!speed || typeof speed !== "object") return "30 ft.";
  return Object.entries(speed)
    .filter(([, v]) => typeof v === "number")
    .map(([k, v]) => (k === "walk" ? `${v} ft.` : `${k} ${v} ft.`))
    .join(", ") || "30 ft.";
}

function savesToString(m) {
  const parts = [];
  for (const ab of ABIL) {
    const v = m[`${ab}_save`];
    if (typeof v === "number") parts.push(`${ab.slice(0, 3).toUpperCase()} ${v >= 0 ? "+" : ""}${v}`);
  }
  return parts.join(", ");
}

function skillsToString(m) {
  if (!m.skills || typeof m.skills !== "object") return "";
  return Object.entries(m.skills)
    .map(([k, v]) => `${k} ${v >= 0 ? "+" : ""}${v}`)
    .join(", ");
}

function mapList(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => x && x.name && x.desc)
    .map((x) => {
      const text = String(x.desc).replace(/\s+/g, " ").trim();
      return {
        name: x.name,
        text,
        nameEs: translateAbilityName(x.name),
        textEs: translateSrdText(text),
      };
    });
}

function mapMonster(m) {
  const slug = m.slug;
  return {
    id: slug,
    nameEn: m.name,
    nameEs: namesEs[slug] ?? m.name,
    size: m.size ?? "Medium",
    type: m.type ? m.type.charAt(0).toUpperCase() + m.type.slice(1) : "Monstruosidad",
    cr: String(m.challenge_rating ?? "0"),
    ac: Number(m.armor_class ?? 10),
    hp: Number(m.hit_points ?? 1),
    hitDice: m.hit_dice ?? undefined,
    speed: speedToString(m.speed),
    abilityScores: {
      str: Number(m.strength ?? 10),
      dex: Number(m.dexterity ?? 10),
      con: Number(m.constitution ?? 10),
      int: Number(m.intelligence ?? 10),
      wis: Number(m.wisdom ?? 10),
      cha: Number(m.charisma ?? 10),
    },
    saves: savesToString(m) || undefined,
    skills: skillsToString(m) || undefined,
    senses: m.senses || undefined,
    languages: m.languages || undefined,
    traits: mapList(m.special_abilities),
    actions: mapList(m.actions),
  };
}

async function main() {
  let url = "https://api.open5e.com/v1/monsters/?document__slug=wotc-srd&limit=100";
  const all = [];
  let page = 1;
  while (url) {
    process.stdout.write(`\r[monsters] Pagina ${page}... (${all.length} acumulados)`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} al pedir ${url}`);
    const data = await res.json();
    for (const m of data.results) all.push(mapMonster(m));
    url = data.next;
    page++;
  }
  all.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(all));
  console.log(`\n[monsters] Listo: ${all.length} monstruos SRD -> ${outFile}`);
}

main().catch((err) => {
  console.error("\n[monsters] Error:", err.message);
  process.exit(1);
});
