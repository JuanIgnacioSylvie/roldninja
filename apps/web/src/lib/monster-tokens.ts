/** Índice generado por `pnpm monsters:tokens`. */
export interface MonsterTokenEntry {
  source: "local" | "drive";
  driveId?: string;
  fileName: string;
  path: string;
  url: string;
}

export interface MonsterTokenIndex {
  sources: { type: string; label: string; path?: string; id?: string }[];
  files: number;
  matched: number;
  srdMatched?: number;
  curatedMatched?: number;
  map: Record<string, MonsterTokenEntry>;
}

/** Monstruos curados (es) → slug SRD para buscar token. */
const CURATED_ALIASES: Record<string, string> = {
  "rata-gigante": "giant-rat",
  bandido: "bandit",
  cultista: "cultist",
  guardia: "guard",
  esqueleto: "skeleton",
  zombi: "zombie",
  lobo: "wolf",
  "araña-gigante": "giant-spider",
  "lobo-terrible": "dire-wolf",
  "oso-pardo": "brown-bear",
  osgo: "bugbear",
  "goblin-jefe": "goblin",
  "armadura-animada": "animated-armor",
  ogro: "ogre",
  mimico: "mimic",
  "cubo-gelatinoso": "gelatinous-cube",
  "buho-oso": "owlbear",
  "espectro-wraith": "wraith",
  "vampiro-engendro": "vampire-spawn",
  "gigante-colinas": "hill-giant",
  azotamentes: "mind-flayer",
  "dragon-rojo-joven": "young-red-dragon",
  contemplador: "beholder",
  "dragon-rojo-adulto": "adult-red-dragon",
};

export function resolveMonsterTokenUrl(
  index: MonsterTokenIndex | null | undefined,
  monsterId: string,
): string | null {
  if (!index?.map) return null;
  const direct = index.map[monsterId];
  if (direct) return direct.url;
  const alias = CURATED_ALIASES[monsterId];
  if (alias && index.map[alias]) return index.map[alias].url;
  return null;
}

let indexPromise: Promise<MonsterTokenIndex | null> | null = null;

export function loadMonsterTokenIndex(): Promise<MonsterTokenIndex | null> {
  if (!indexPromise) {
    indexPromise = fetch("/monster-tokens/index.json")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return indexPromise;
}
