/**
 * Convierte un export JSON de Azgaar (full) a archivo .map cargable.
 *
 * Uso:
 *   node scripts/json-to-azgaar-map.mjs [entrada.json] [salida.map]
 *
 * Requiere un .map plantilla solo para el SVG embebido (fila 5):
 *   AZGAAR_MAP_TEMPLATE=C:/ruta/plantilla.map
 * Por defecto busca Zytzayna.map en el Escritorio.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VERSION = "1.125.0";
const LICENSE = "File can be loaded in azgaar.github.io/Fantasy-Map-Generator";

function loadTemplateMap() {
  const candidates = [
    process.env.AZGAAR_MAP_TEMPLATE,
    "C:/Users/juans/Desktop/Jarvilia.map",
    "C:/Users/juans/Desktop/Zytzayna.map",
  ].filter(Boolean);

  for (const p of candidates) {
    if (existsSync(p)) {
      console.log(`[json-to-map] Plantilla SVG: ${p}`);
      return readFileSync(p, "utf8").split("\r\n");
    }
  }
  throw new Error(
    "No se encontró .map plantilla para el SVG. Exportá cualquier mapa como .map desde Azgaar y definí AZGAAR_MAP_TEMPLATE.",
  );
}

function arrField(cells, key, fallback = 0) {
  return cells.map((c) => (c[key] ?? fallback)).join(",");
}

function roundPop(cells) {
  return cells
    .map((c) => {
      const p = c.pop ?? 0;
      return Math.round(p * 10000) / 10000;
    })
    .join(",");
}

function buildNamesData(nameBases) {
  if (!nameBases?.length) return "";
  return nameBases
    .map((b) => `${b.name}|${b.min}|${b.max}|${b.d ?? ""}|${b.m ?? 0}|${b.b ?? ""}`)
    .join("/");
}

function buildBiomesRow(biomesData) {
  const color = (biomesData.color ?? []).join(",");
  const habitability = (biomesData.habitability ?? biomesData.name?.map(() => 1) ?? []).join(",");
  const name = (biomesData.name ?? []).join(",");
  return `${color}|${habitability}|${name}`;
}

function buildSettingsRow(settings) {
  const opts = settings.options ?? {};
  return [
    settings.distanceUnit ?? "km",
    settings.distanceScale ?? 3,
    settings.areaUnit ?? "square",
    settings.heightUnit ?? "m",
    settings.heightExponent ?? 1.8,
    settings.temperatureScale ?? "°C",
    "", "", "", "", "", "",
    settings.populationRate ?? 2,
    settings.urbanization ?? "",
    settings.mapSize ?? 50,
    settings.latitude ?? 50,
    "", "",
    settings.prec ?? 100,
    JSON.stringify(opts),
    settings.mapName ?? "Map",
    settings.hideLabels ? 1 : 0,
    settings.stylePreset ?? "default",
    settings.rescaleLabels ? 1 : 0,
    settings.urbanDensity ?? 1,
    settings.longitude ?? 50,
    opts.growthRate ?? 1.2,
  ].join("|");
}

function patchSvg(svg, width, height) {
  return svg
    .replace(/width="[^"]*"/, `width="${width}"`)
    .replace(/height="[^"]*"/, `height="${height}"`);
}

function gridCellsArray(grid) {
  if (Array.isArray(grid.cells)) return grid.cells;
  return Object.values(grid.cells).sort((a, b) => a.i - b.i);
}

function convert(json, templateRows) {
  const info = json.info ?? {};
  const settings = json.settings ?? {};
  const width = info.width ?? 1920;
  const height = info.height ?? 911;
  const seed = info.seed ?? String(Date.now());
  const mapId = info.mapId ?? Date.now();
  const date = new Date().toISOString().slice(0, 10);

  const packCells = json.pack.cells;
  const gridCells = gridCellsArray(json.grid);

  const svg = patchSvg(templateRows[5] ?? templateRows.find((r) => r?.startsWith("<svg")), width, height);

  const { spacing, cellsX, cellsY, boundary, points, features, cellsDesired } = json.grid;
  const gridGeneral = JSON.stringify({ spacing, cellsX, cellsY, boundary, points, features, cellsDesired });

  const rows = [
    [VERSION, LICENSE, date, seed, width, height, mapId].join("|"),
    buildSettingsRow(settings),
    JSON.stringify(json.mapCoordinates ?? {}),
    buildBiomesRow(json.biomesData ?? {}),
    JSON.stringify(json.notes ?? []),
    svg,
    gridGeneral,
    arrField(gridCells, "h", 0),
    arrField(gridCells, "prec", 0),
    arrField(gridCells, "f", 0),
    arrField(gridCells, "t", 0),
    arrField(gridCells, "temp", 0),
    JSON.stringify(json.pack.features ?? []),
    JSON.stringify(json.pack.cultures ?? []),
    JSON.stringify(json.pack.states ?? []),
    JSON.stringify(json.pack.burgs ?? []),
    arrField(packCells, "biome", 0),
    arrField(packCells, "burg", 0),
    arrField(packCells, "conf", 0),
    arrField(packCells, "culture", 0),
    arrField(packCells, "fl", 0),
    roundPop(packCells),
    arrField(packCells, "r", 0),
    "",
    arrField(packCells, "s", 0),
    arrField(packCells, "state", 0),
    arrField(packCells, "religion", 0),
    arrField(packCells, "province", 0),
    "",
    JSON.stringify(json.pack.religions ?? [{ i: 0, name: "No religion" }]),
    JSON.stringify(json.pack.provinces ?? [0]),
    buildNamesData(json.nameBases),
    JSON.stringify(json.pack.rivers ?? []),
    templateRows[33] ?? "",
    templateRows[34] ?? "[]",
    JSON.stringify(json.pack.markers ?? []),
    JSON.stringify(json.pack.cells?.routes ?? {}),
    JSON.stringify(json.pack.routes ?? []),
    JSON.stringify(json.pack.zones ?? []),
    JSON.stringify(json.pack.ice ?? []),
    arrField(packCells, "good", 0),
    JSON.stringify(json.pack.goods ?? []),
    JSON.stringify(json.pack.markets ?? []),
    JSON.stringify(json.pack.deals ?? []),
    arrField(packCells, "market", 0),
  ];

  return rows.join("\r\n");
}

function main() {
  const inPath = process.argv[2] ?? join(__dirname, "..", "maps", "Valtherion.json");
  const outPath =
    process.argv[3] ??
    inPath.replace(/\.json$/i, ".map").replace(/maps[\\/]Valtherion\.json/i, "maps/Valtherion.map");

  if (!existsSync(inPath)) {
    console.error(`No existe: ${inPath}`);
    process.exit(1);
  }

  console.log(`[json-to-map] Leyendo ${inPath}`);
  const json = JSON.parse(readFileSync(inPath, "utf8"));
  const template = loadTemplateMap();
  const mapData = convert(json, template);

  writeFileSync(outPath, mapData, "utf8");
  const mb = (Buffer.byteLength(mapData) / 1024 / 1024).toFixed(2);
  console.log(`[json-to-map] Guardado: ${outPath} (${mb} MB)`);
  console.log("[json-to-map] Cargalo en Azgaar con Load → Import o arrastrando el .map");
  console.log("[json-to-map] Si el terreno no coincide, usá Tools → Regenerate en Azgaar (el lore ya está en los datos).");
}

main();
