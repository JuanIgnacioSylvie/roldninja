// Indexa tokens PNG (local + Google Drive) y los mapea a monstruos SRD.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "apps", "web", "public", "monster-tokens");
const indexFile = join(outDir, "index.json");
const foldersConfig = join(__dirname, "monster-token-folders.json");

/** Nombres de archivo Tom Cartos → slug SRD cuando el match automático falla. */
const FILE_MONSTER_ALIASES = {
  "giantfirebeetle small beast": "giant-fire-beetle",
  "silver dragon wormling medium": "silver-dragon-wyrmling",
  "air large elemental": "air-elemental",
  "earth large elemental": "earth-elemental",
  "fire large elemental": "fire-elemental",
  "water large elemental": "water-elemental",
};

/** Monstruos curados (no SRD) que tienen token con nombre distinto al id. */
const CURATED_MONSTERS = [
  { id: "contemplador", keys: ["beholder", "contemplador"] },
  { id: "azotamentes", keys: ["mind flayer", "azotamentes", "illithid"] },
];

function sourcePriority(file) {
  if (file.path?.startsWith("wotc-2024/")) return 3;
  if (file.source === "local") return 2;
  return 1;
}

function driveThumbUrl(driveId) {
  return `https://drive.google.com/thumbnail?id=${driveId}&sz=w256`;
}

function publicTokenUrl(relativePath) {
  return `/monster-tokens/${relativePath.split("/").map(encodeURIComponent).join("/")}`;
}

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugToPhrase(slug) {
  return normalize(slug.replace(/-/g, " "));
}

function splitCamelCase(s) {
  return s.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function fileNameKeys(fileName) {
  const base = fileName.replace(/\.png$/i, "").replace(/[-_]\d+$/, "");
  const keys = new Set([normalize(base), normalize(splitCamelCase(base))]);

  const parts = base.split("_");
  if (parts.length > 1) {
    keys.add(normalize(parts[0]));
    keys.add(normalize(splitCamelCase(parts[0])));
  }

  const tomCartos = base.match(/^([a-z0-9]+(?:_[a-z0-9]+)?)_/i);
  if (tomCartos) {
    keys.add(normalize(tomCartos[1].replace(/_/g, " ")));
  }

  for (const [alias, slug] of Object.entries(FILE_MONSTER_ALIASES)) {
    if (keys.has(alias) || [...keys].some((k) => k.startsWith(alias) || alias.startsWith(k))) {
      keys.add(slugToPhrase(slug));
    }
  }

  return [...keys].filter(Boolean);
}

async function listDriveFolder(folderId) {
  const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} al listar carpeta ${folderId}`);
  const html = await res.text();
  const entries = [];
  const re = /data-id="([a-zA-Z0-9_-]{20,})"[^>]*data-tooltip="([^"]+)"/g;
  for (const m of html.matchAll(re)) {
    const name = m[2].replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    const kind = name.endsWith(" Shared folder")
      ? "folder"
      : name.endsWith(" Image")
        ? "file"
        : "other";
    entries.push({ id: m[1], name, kind });
  }
  return entries;
}

async function crawlDrive(folderId, path = []) {
  const items = await listDriveFolder(folderId);
  const files = [];
  for (const item of items) {
    if (item.kind === "folder") {
      const sub = item.name.replace(/ Shared folder$/, "");
      files.push(...(await crawlDrive(item.id, [...path, sub])));
    } else if (item.kind === "file") {
      const base = item.name.replace(/ Image$/, "");
      files.push({
        source: "drive",
        driveId: item.id,
        fileName: base,
        path: [...path, base].join("/"),
      });
    }
  }
  return files;
}

function crawlLocal(relativeRoot) {
  const root = join(outDir, relativeRoot);
  const files = [];

  function walk(dir, parts) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full, [...parts, name]);
      } else if (/\.png$/i.test(name)) {
        const rel = relative(outDir, full).replace(/\\/g, "/");
        files.push({
          source: "local",
          fileName: name,
          path: rel,
        });
      }
    }
  }

  if (statSync(root).isDirectory()) walk(root, []);
  return files;
}

function monsterKeys(monster) {
  const keys = [slugToPhrase(monster.id), normalize(monster.nameEn), normalize(monster.nameEs)];
  if (monster.extraKeys) keys.push(...monster.extraKeys.map(normalize));
  return keys.filter(Boolean);
}

function scoreMatch(monster, file) {
  const keys = monsterKeys(monster);
  const fileKeys = fileNameKeys(file.fileName);

  for (const key of keys) {
    if (fileKeys.includes(key)) return 100;
  }

  for (const key of keys) {
    const starts = fileKeys.filter((fk) => fk.startsWith(`${key} `) || fk === key);
    if (starts.length) return 80;
    const n = normalize(file.fileName);
    if (n.startsWith(`${key} `) || n === key) return 70;
  }

  for (const key of keys) {
    const n = normalize(file.fileName);
    if (n.startsWith(`${key} `) || n === key) return 50;
  }

  for (const [alias, slug] of Object.entries(FILE_MONSTER_ALIASES)) {
    if (slug === monster.id && fileKeys.some((fk) => fk.includes(alias) || alias.includes(fk))) return 90;
  }

  return 0;
}

function bestMatch(monster, files) {
  let best = null;
  let bestScore = 0;
  let bestPriority = 0;
  for (const file of files) {
    const score = scoreMatch(monster, file);
    const priority = sourcePriority(file);
    if (score > bestScore || (score === bestScore && score > 0 && priority > bestPriority)) {
      bestScore = score;
      bestPriority = priority;
      best = file;
    }
  }
  return bestScore >= 50 ? best : null;
}

function toEntry(file) {
  if (file.source === "local") {
    return {
      source: "local",
      fileName: file.fileName,
      path: file.path,
      url: publicTokenUrl(file.path),
    };
  }
  return {
    source: "drive",
    driveId: file.driveId,
    fileName: file.fileName,
    path: file.path,
    url: driveThumbUrl(file.driveId),
  };
}

async function main() {
  const sources = JSON.parse(readFileSync(foldersConfig, "utf8"));
  const localFiles = [];
  const driveFiles = [];

  for (const src of sources) {
    if (src.type === "local") {
      process.stdout.write(`[tokens] ${src.label}...`);
      const files = crawlLocal(src.path);
      localFiles.push(...files);
      process.stdout.write(` ${files.length} PNG\n`);
    } else if (src.type === "drive") {
      process.stdout.write(`[tokens] ${src.label}...`);
      const files = await crawlDrive(src.id);
      driveFiles.push(...files);
      process.stdout.write(` ${files.length} PNG\n`);
    }
  }

  console.log(`[tokens] Local: ${localFiles.length}, Drive: ${driveFiles.length}`);

  const monsters = JSON.parse(
    readFileSync(join(__dirname, "..", "apps", "web", "public", "srd-monsters.json"), "utf8"),
  );

  const allFiles = [...localFiles, ...driveFiles];
  const map = {};
  for (const m of monsters) {
    const token = bestMatch(m, allFiles);
    if (token) map[m.id] = toEntry(token);
  }

  let curatedMatched = 0;
  for (const c of CURATED_MONSTERS) {
    if (map[c.id]) continue;
    const pseudo = { id: c.id, nameEn: c.keys[0], nameEs: c.keys.at(-1), extraKeys: c.keys };
    const token = bestMatch(pseudo, allFiles);
    if (token) {
      map[c.id] = toEntry(token);
      curatedMatched++;
    }
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    indexFile,
    JSON.stringify(
      {
        sources,
        files: allFiles.length,
        matched: Object.keys(map).length,
        srdMatched: monsters.filter((m) => map[m.id]).length,
        curatedMatched,
        map,
      },
      null,
      2,
    ),
  );
  console.log(
    `[tokens] ${monsters.filter((m) => map[m.id]).length}/${monsters.length} SRD, ${curatedMatched} curados -> ${indexFile}`,
  );
}

main().catch((err) => {
  console.error("[tokens] Error:", err.message);
  process.exit(1);
});
