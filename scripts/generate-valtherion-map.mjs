/**
 * Genera un export JSON completo de Azgaar's Fantasy Map Generator
 * para el mundo de Valtherion (Era del Hombre).
 *
 * Uso:
 *   node scripts/generate-valtherion-map.mjs [ruta-salida.json]
 *
 * Opcional: VALTHERION_TEMPLATE=/ruta/a/plantilla.json
 * (export .json de Azgaar usado solo como esqueleto Voronoi; la geografía y el lore son nuevos)
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const WIDTH = 1920;
const HEIGHT = 911;
const MAP_NAME = "Valtherion";
const SEED = "782946103";

// --- Geografía: 3 continentes + 3 islas en triángulo equilátero ---
const ISLANDS = [
  { name: "Nimrael", cx: 960, cy: 130, r: 88, featureName: "Isla de Nimrael" },
  { name: "Drakonys", cx: 510, cy: 400, r: 82, featureName: "Isla de Drakonys" },
  { name: "Selvareth", cx: 1410, cy: 400, r: 82, featureName: "Isla de Selvareth" },
];

const CONTINENTS = [
  {
    id: "korthaven",
    name: "Korthaven",
    cx: 260,
    cy: 430,
    rx: 200,
    ry: 260,
    chaos: true,
  },
  {
    id: "aurion",
    name: "Aurion",
    cx: 960,
    cy: 760,
    rx: 220,
    ry: 130,
    chaos: null,
  },
  {
    id: "lexmara",
    name: "Lexmara",
    cx: 1660,
    cy: 430,
    rx: 200,
    ry: 260,
    chaos: false,
  },
];

function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function inEllipse(x, y, cx, cy, rx, ry) {
  return ((x - cx) ** 2) / rx ** 2 + ((y - cy) ** 2) / ry ** 2 <= 1;
}

function landHeight(x, y) {
  for (const isl of ISLANDS) {
    const d = dist(x, y, isl.cx, isl.cy);
    if (d < isl.r) return 25 + Math.round((1 - d / isl.r) * 55);
  }
  for (const c of CONTINENTS) {
    if (inEllipse(x, y, c.cx, c.cy, c.rx, c.ry)) {
      const nx = (x - c.cx) / c.rx;
      const ny = (y - c.cy) / c.ry;
      const edge = 1 - Math.sqrt(nx * nx + ny * ny);
      return 22 + Math.round(edge * 58);
    }
  }
  return 5 + Math.floor(Math.random() * 8);
}

function regionAt(x, y) {
  for (const isl of ISLANDS) {
    if (dist(x, y, isl.cx, isl.cy) < isl.r) return { type: "island", id: isl.name };
  }
  for (const c of CONTINENTS) {
    if (inEllipse(x, y, c.cx, c.cy, c.rx, c.ry)) return { type: "continent", id: c.id };
  }
  return { type: "ocean", id: null };
}

// --- Lore: estados, culturas, religiones ---
const STATE_DEFS = [
  { i: 0, name: "Neutrals", neutral: true },
  {
    i: 1,
    name: "Sangrevasto",
    fullName: "Reino de Sangrevasto",
    form: "Monarchy",
    formName: "Kingdom",
    continent: "korthaven",
    color: "#8b1a1a",
    culture: 1,
    religion: 3,
    capital: "Cenizabrava",
    type: "Hill",
    chaos: true,
    burgs: [
      { name: "Cenizabrava", pop: 42, type: "Generic", port: 0 },
      { name: "Garrasangre", pop: 18, type: "Generic" },
      { name: "Mortisvalle", pop: 12, type: "River" },
      { name: "Hextorhold", pop: 15, type: "Hill" },
    ],
  },
  {
    i: 2,
    name: "Ceniza",
    fullName: "Confederación de Señores de Ceniza",
    form: "Confederation",
    formName: "Confederation",
    continent: "korthaven",
    color: "#4a3728",
    culture: 2,
    religion: 4,
    capital: "Brassara",
    type: "Generic",
    chaos: true,
    burgs: [
      { name: "Brassara", pop: 28, type: "Generic" },
      { name: "Rencorford", pop: 9, type: "Generic" },
      { name: "Pira del Cuervo", pop: 7, type: "Naval", port: 1 },
    ],
  },
  {
    i: 3,
    name: "Umbravalle",
    fullName: "Dominio de Umbravalle",
    form: "Theocracy",
    formName: "Theocracy",
    continent: "korthaven",
    color: "#2d1b4e",
    culture: 3,
    religion: 5,
    capital: "Nigromar",
    type: "Lake",
    chaos: true,
    burgs: [
      { name: "Nigromar", pop: 22, type: "Generic" },
      { name: "Sepulcris", pop: 11, type: "Generic" },
    ],
  },
  {
    i: 4,
    name: "Olvido",
    fullName: "Tierras del Olvido",
    form: "Anarchy",
    formName: "Anarchy",
    continent: "aurion",
    color: "#6b705c",
    culture: 4,
    religion: 6,
    capital: "Ruinas de Lumineth",
    type: "Generic",
    burgs: [
      { name: "Ruinas de Lumineth", pop: 8, type: "Generic" },
      { name: "Campo de las Mil Espadas", pop: 3, type: "Generic" },
      { name: "Memoria Perdida", pop: 5, type: "Generic" },
    ],
  },
  {
    i: 5,
    name: "Concordia",
    fullName: "República de Concordia",
    form: "Republic",
    formName: "Republic",
    continent: "aurion",
    color: "#457b9d",
    culture: 5,
    religion: 7,
    capital: "Mesas de la Paz",
    type: "River",
    burgs: [
      { name: "Mesas de la Paz", pop: 31, type: "Generic" },
      { name: "Puente de Hierro", pop: 14, type: "River" },
      { name: "Villa del Mediador", pop: 10, type: "Generic" },
    ],
  },
  {
    i: 6,
    name: "Frontera",
    fullName: "Marca Fronteriza de Aurion",
    form: "Monarchy",
    formName: "Marches",
    continent: "aurion",
    color: "#a8a29e",
    culture: 6,
    religion: 8,
    capital: "Vigilia del Alba",
    type: "Hill",
    burgs: [
      { name: "Vigilia del Alba", pop: 19, type: "Hill" },
      { name: "Torreón Gris", pop: 8, type: "Hill" },
    ],
  },
  {
    i: 7,
    name: "Solmarest",
    fullName: "Imperio de Solmarest",
    form: "Empire",
    formName: "Empire",
    continent: "lexmara",
    color: "#ffd166",
    culture: 7,
    religion: 9,
    capital: "Solmarest",
    type: "Generic",
    order: true,
    burgs: [
      { name: "Solmarest", pop: 58, type: "Generic" },
      { name: "Aureford", pop: 24, type: "River" },
      { name: "Catedral de Pholtus", pop: 16, type: "Generic" },
      { name: "Puerto Radiante", pop: 20, type: "Naval", port: 1 },
    ],
  },
  {
    i: 8,
    name: "Aurelion",
    fullName: "Reino de Aurelion",
    form: "Monarchy",
    formName: "Kingdom",
    continent: "lexmara",
    color: "#f4a261",
    culture: 8,
    religion: 10,
    capital: "Heliopolis",
    type: "Generic",
    order: true,
    burgs: [
      { name: "Heliopolis", pop: 45, type: "Generic" },
      { name: "San Pelor", pop: 22, type: "Generic" },
      { name: "Valle Dorado", pop: 13, type: "River" },
    ],
  },
  {
    i: 9,
    name: "Lexford",
    fullName: "Ducado de Lexford",
    form: "Monarchy",
    formName: "Duchy",
    continent: "lexmara",
    color: "#2a6f97",
    culture: 9,
    religion: 11,
    capital: "Lexford",
    type: "River",
    order: true,
    burgs: [
      { name: "Lexford", pop: 38, type: "River" },
      { name: "Heironea", pop: 21, type: "Generic" },
      { name: "Puerto del Juramento", pop: 17, type: "Naval", port: 1 },
    ],
  },
  {
    i: 10,
    name: "Nimrael",
    fullName: "Santuario Élfico de Nimrael",
    form: "Theocracy",
    formName: "Sanctuary",
    island: "Nimrael",
    color: "#9d4edd",
    culture: 10,
    religion: 12,
    capital: "Alfheimar",
    type: "Generic",
    burgs: [
      { name: "Alfheimar", pop: 6, type: "Generic" },
      { name: "Torre de Corellon", pop: 2, type: "Generic" },
    ],
  },
  {
    i: 11,
    name: "Drakonys",
    fullName: "Dominio de Drakonys",
    form: "Monarchy",
    formName: "Kingdom",
    island: "Drakonys",
    color: "#c1121f",
    culture: 11,
    religion: 13,
    capital: "Escama de Platino",
    type: "Hill",
    burgs: [
      { name: "Escama de Platino", pop: 12, type: "Generic" },
      { name: "Cueva del Concilio", pop: 4, type: "Hill" },
    ],
  },
  {
    i: 12,
    name: "Selvareth",
    fullName: "Archipiélago Verde de Selvareth",
    form: "Tribe",
    formName: "Tribes",
    island: "Selvareth",
    color: "#2d6a4f",
    culture: 12,
    religion: 14,
    capital: "Bosque Eterno",
    type: "Generic",
    burgs: [
      { name: "Bosque Eterno", pop: 9, type: "Generic" },
      { name: "Claro de Ehlonna", pop: 5, type: "Generic" },
    ],
  },
];

const CULTURES = [
  { name: "Wildlands", i: 0, type: "Generic", base: 1 },
  { name: "Korthaviano", i: 1, type: "Generic", base: 1, origins: [0] },
  { name: "Cenizero", i: 2, type: "Nomadic", base: 2, origins: [1] },
  { name: "Umbrío", i: 3, type: "Generic", base: 3, origins: [1] },
  { name: "Olvidado", i: 4, type: "Generic", base: 4, origins: [0] },
  { name: "Concordio", i: 5, type: "Generic", base: 5, origins: [4] },
  { name: "Fronterizo", i: 6, type: "Generic", base: 6, origins: [5] },
  { name: "Solmarense", i: 7, type: "Generic", base: 7, origins: [0] },
  { name: "Aureliano", i: 8, type: "Generic", base: 8, origins: [7] },
  { name: "Lexfordiano", i: 9, type: "Generic", base: 9, origins: [7] },
  { name: "Élfico residual", i: 10, type: "Generic", base: 10, origins: [0] },
  { name: "Drakoniano", i: 11, type: "Generic", base: 11, origins: [0] },
  { name: "Selvano", i: 12, type: "Generic", base: 12, origins: [0] },
];

const RELIGIONS = [
  { name: "No religion", i: 0 },
  { name: "Culto de Erythnul", i: 1, origins: [0] },
  { name: "Seguidores de Iuz", i: 2, origins: [0] },
  { name: "Iglesia de Erythnul", i: 3, origins: [1] },
  { name: "Hextorianismo", i: 4, origins: [0] },
  { name: "Orden de Incabulos", i: 5, origins: [0] },
  { name: "Memoria de Corellon", i: 6, origins: [0] },
  { name: "Fe de Rao", i: 7, origins: [0] },
  { name: "Culto de Cuthbert", i: 8, origins: [0] },
  { name: "Iglesia de Pholtus", i: 9, origins: [0] },
  { name: "Culto de Pelor", i: 10, origins: [0] },
  { name: "Orden de Heironeous", i: 11, origins: [0] },
  { name: "Devoción a Corellon", i: 12, origins: [0] },
  { name: "Concilio de Bahamut", i: 13, origins: [0] },
  { name: "Círculo de Ehlonna", i: 14, origins: [0] },
];

const MARKERS = [
  {
    icon: "⚔️",
    type: "battlefields",
    name: "Campo de las Mil Espadas",
    x: 920,
    y: 720,
    legend:
      "Donde la caída de los elfos dejó un mar de acero enterrado bajo flores olvidadas. Ningún cronista humano recuerda los nombres de los caídos.",
  },
  {
    icon: "🌋",
    type: "volcanoes",
    name: "Monte Devorador",
    x: 180,
    y: 520,
    legend: "Se dice que aquí los elfos abrieron un portal hacia las profundidades del plano. Lo que salió no regresó; lo que entró no volvió.",
  },
  {
    icon: "🗿",
    type: "monuments",
    name: "Puerta de Nimrael",
    x: 960,
    y: 160,
    legend:
      "Ruinas élficas en la cima del triángulo sagrado. Inscripciones en lengua feérica: «La luz no fue bienvenida en todas partes».",
  },
  {
    icon: "🐉",
    type: "dragons",
    name: "Concilio Draconiano",
    x: 520,
    y: 390,
    legend: "Isla Drakonys: dragones metálicos y cromáticos mantienen una tregua frágil bajo la sombra de Bahamut y Tiamat.",
  },
  {
    icon: "🌳",
    type: "forests",
    name: "Bosque Eterno",
    x: 1400,
    y: 410,
    legend: "Selvareth: último refugio druidico donde Ehlonna y Obad-Hai aún son invocados sin templos de piedra.",
  },
  {
    icon: "⚖️",
    type: "monuments",
    name: "Gran Tribunal de Pholtus",
    x: 1680,
    y: 380,
    legend: "Lexmara: la ley escrita reemplazó la espada. Aquí se juzgan las disputas de medio continente.",
  },
  {
    icon: "☠️",
    type: "ruins",
    name: "Profundidades Selladas",
    x: 240,
    y: 580,
    legend:
      "Relato inconcluso: los reinos élficos incursionaron cegados por el poder de las profundidades… y allí quedaron enterrados para siempre.",
  },
  {
    icon: "🏰",
    type: "castles",
    name: "Fortaleza de Solmarest",
    x: 1640,
    y: 420,
    legend: "Capital del orden. Heironeous y Pholtus bendicen sus muros; el caos de Korthaven parece un rumor lejano.",
  },
];

const NOTES = [
  {
    id: "world-history",
    name: "Valtherion — Era del Hombre",
    legend: `VALTHERION — EL MUNDO TRIPARTITO

Geografía: tres continentes (Korthaven al oeste, Aurion al sur, Lexmara al este) y tres grandes islas — Nimrael, Drakonys y Selvareth — cuyos centros forman un triángulo equilátero perfecto en el Mar Interior.

ERA ÉLFICA (pasada): reinos élficos llevaron luz y prosperidad a cada rincón del mundo conocido. Pero incursionaron en las profundidades del plano, cegados por el poder que allí podían encontrar… y en las profundidades quedaron enterrados para siempre. [Relato abstracto inconcluso]

ERA DEL HOMBRE (actual): la caída de los elfos no fue silenciosa. Ningún trono se salvó de ser salpicado con sangre. Los hombres llegaron para transformar esos campos de batalla en mesas de conversación.

Han pasado cientos de años. Batallas, héroes y enseñanzas cayeron en el olvido, así como lo terrible de una guerra de tal magnitud.

Hoy: el caos reina en Korthaven (continente occidental). La legalidad y el orden dominan Lexmara (oriental). Aurion, al sur, guarda ruinas y diplomacia entre ambos mundos.

Población mundial: ~80% humanos.`,
  },
  {
    id: "pantheon",
    name: "Panteón de Valtherion",
    legend: `DEIDADES VENERADAS EN VALTHERION

Monte Celestia: Bahamut, Heironeous, Moradin, Rao
Arcadia: Cuthbert, Pholtus, Ulaa, Berei del Hogar
Elysium: Pelor
Ysgard: Kord, Olidammara
Outlands: Boccob, Fharlanghn, Obad-Hai
Beastlands: Ehlonna
Acheron: Hextor, Wee Jas
Hades: Incabulos
Carceri: Nerull
Gehenna: Syrul
Pandemonium: Erythnul
Mechanus: Istus
Limbo: Ralishaz
Abismo (capa 66): Lolth
Nueve Infiernos: Tiamat
Plano Material: Beory, Iuz
Corellon danza entre planos — culto residual entre elfos dispersos
Gruumsh: patrón orco, sin plano fijo
Tharizdun: Devorador, cultos nihilistas en las sombras
Vecna: Susurrado, buscadores de secretos`,
  },
  {
    id: "korthaven",
    name: "Korthaven — Continente del Caos",
    legend: `El occidente arde en guerras de señores, cultos de Erythnul e Iuz, y teocracias sombrías bajo Incabulos. Sangrevasto, la Confederación de Ceniza y Umbravalle disputan cada valle.`,
  },
  {
    id: "lexmara",
    name: "Lexmara — Continente del Orden",
    legend: `El oriente prospera bajo el Imperio de Solmarest, el Reino de Aurelion y el Ducado de Lexford. Pholtus, Heironeous y Pelor estructuran la vida pública. Las leyes reemplazaron las espadas — al menos en apariencia.`,
  },
];

function simpleCoa(t1 = "or", charge = "star", t = "gules") {
  return {
    t1,
    charges: [{ charge, t, p: "e", size: 0.5 }],
    shield: "heater",
  };
}

function loadTemplate() {
  const env = process.env.VALTHERION_TEMPLATE;
  const candidates = [
    env,
    "C:/Users/juans/Desktop/Jarvilia Full 2026-06-21-18-25.json",
    join(root, "maps", "template.json"),
  ].filter(Boolean);

  for (const p of candidates) {
    if (existsSync(p)) {
      console.log(`[valtherion] Plantilla Voronoi: ${p}`);
      return JSON.parse(readFileSync(p, "utf8"));
    }
  }
  throw new Error(
    "No se encontró plantilla JSON de Azgaar. Exporta un mapa desde Azgaar o define VALTHERION_TEMPLATE.",
  );
}

function assignStateToRegion(reg) {
  if (reg.type === "ocean") return 0;
  if (reg.type === "island") {
    const st = STATE_DEFS.find((s) => s.island === reg.id);
    return st?.i ?? 0;
  }
  const candidates = STATE_DEFS.filter((s) => s.continent === reg.id && !s.neutral);
  if (!candidates.length) return 0;
  return candidates[0].i;
}

function buildMap(template) {
  const map = structuredClone(template);

  map.info = {
    version: "1.125.1",
    description: "Azgaar's Fantasy Map Generator output: azgaar.github.io/Fantasy-map-generator",
    exportedAt: new Date().toISOString(),
    mapName: MAP_NAME,
    width: WIDTH,
    height: HEIGHT,
    seed: SEED,
    mapId: Date.now(),
  };

  map.settings = {
    ...map.settings,
    mapName: MAP_NAME,
    options: {
      ...(map.settings?.options ?? {}),
      pinNotes: false,
    },
  };

  map.mapCoordinates = {
    latT: 18,
    latN: 46.3,
    latS: 28.3,
    lonT: 37.9,
    lonW: -19,
    lonE: 18.9,
  };

  // Repintar celdas pack
  const cells = map.pack.cells;
  const landCells = [];
  const regionCells = { korthaven: [], aurion: [], lexmara: [], islands: {} };
  for (const isl of ISLANDS) regionCells.islands[isl.name] = [];

  for (const cell of cells) {
    if (!cell?.p) continue;
    const [x, y] = cell.p;
    const h = landHeight(x, y);
    cell.h = h;
    const isLand = h >= 20;
    cell.t = isLand ? 1 : -1;
    cell.biome = isLand ? (h > 60 ? 9 : h > 45 ? 6 : 4) : 0;
    cell.pop = isLand ? Math.max(1, Math.round((h - 18) / 8)) : 0;

    const reg = regionAt(x, y);
    if (isLand) {
      landCells.push(cell.i);
      if (reg.type === "continent") regionCells[reg.id]?.push(cell.i);
      if (reg.type === "island") regionCells.islands[reg.id]?.push(cell.i);
    }

    cell.state = 0;
    cell.culture = 0;
    cell.religion = 0;
    cell.burg = 0;
    cell.province = 0;
    cell.f = isLand ? 2 : 1;
  }

  // Features: océano + continente principal + islas
  map.pack.features = [
    0,
    {
      i: 1,
      type: "ocean",
      land: false,
      border: true,
      cells: cells.length - landCells.length,
      firstCell: 0,
      vertices: [],
      area: 0,
      shoreline: [],
      height: 0,
    },
    {
      i: 2,
      type: "island",
      land: true,
      border: false,
      cells: landCells.length,
      firstCell: landCells[0] ?? 12,
      vertices: [],
      area: landCells.length * 400,
      shoreline: [],
      height: 0,
      group: "continent",
    },
    ...ISLANDS.map((isl, idx) => ({
      i: 3 + idx,
      type: "island",
      land: true,
      border: false,
      cells: regionCells.islands[isl.name]?.length ?? 0,
      firstCell: regionCells.islands[isl.name]?.[0] ?? 0,
      vertices: [],
      area: (regionCells.islands[isl.name]?.length ?? 0) * 200,
      shoreline: [],
      height: 0,
      group: "isle",
      name: isl.featureName,
    })),
  ];

  // Asignar feature id en celdas de tierra
  for (const cell of cells) {
    if (cell.h < 20) {
      cell.f = 1;
      continue;
    }
    const reg = regionAt(cell.p[0], cell.p[1]);
    if (reg.type === "island") {
      const idx = ISLANDS.findIndex((i) => i.name === reg.id);
      cell.f = 3 + idx;
    } else {
      cell.f = 2;
    }
  }

  // Estados
  const activeStates = STATE_DEFS.filter((s) => !s.neutral);
  map.pack.states = [
    {
      i: 0,
      name: "Neutrals",
      salesTax: 0,
      pollTax: 0,
      treasury: 0,
      neighbors: [],
      diplomacy: [],
      urban: 0,
      rural: 0,
      burgs: 0,
      area: 0,
      cells: 0,
      provinces: [],
    },
    ...activeStates.map((s) => ({
      i: s.i,
      name: s.name,
      fullName: s.fullName,
      form: s.form,
      formName: s.formName,
      expansionism: s.order ? 1.2 : s.chaos ? 2.8 : 1.5,
      type: s.type ?? "Generic",
      color: s.color,
      culture: s.culture,
      capital: null,
      center: 0,
      salesTax: s.order ? 0.12 : 0.05,
      pollTax: s.order ? 0.18 : 0.08,
      treasury: Math.round(Math.random() * 200),
      neighbors: [],
      diplomacy: activeStates.map((o) => {
        if (o.i === s.i) return "x";
        if (s.chaos && o.order) return "Enemy";
        if (s.order && o.chaos) return "Enemy";
        if (s.chaos && o.chaos) return "Suspicion";
        if (s.order && o.order) return "Ally";
        return "Neutral";
      }),
      urban: 0,
      rural: 0,
      burgs: s.burgs.length,
      area: 1000,
      cells: 50,
      provinces: [],
      coa: simpleCoa(
        s.order ? "argent" : s.chaos ? "sable" : "vert",
        s.order ? "scale" : s.chaos ? "skull" : "tree",
        s.order ? "azure" : s.chaos ? "gules" : "or",
      ),
    })),
  ];

  // Burgs
  const burgs = [{ i: 0, name: "Neutrals", cell: 0, x: 0, y: 0, state: 0, culture: 0 }];
  let burgId = 1;
  const stateCenters = {};

  for (const st of activeStates) {
    let bestCell = null;
    let bestScore = -1;
    for (const cell of cells) {
      if (cell.h < 20) continue;
      const reg = regionAt(cell.p[0], cell.p[1]);
      let match = false;
      if (st.island) match = reg.type === "island" && reg.id === st.island;
      else match = reg.type === "continent" && reg.id === st.continent;
      if (!match) continue;
      const score = cell.h + cell.pop;
      if (score > bestScore) {
        bestScore = score;
        bestCell = cell;
      }
    }

    for (const bDef of st.burgs) {
      let cell = bestCell;
      if (bDef.name === st.capital && bestCell) {
        cell = bestCell;
      } else {
        for (const c of cells) {
          if (c.h < 20) continue;
          const reg = regionAt(c.p[0], c.p[1]);
          let match = false;
          if (st.island) match = reg.type === "island" && reg.id === st.island;
          else match = reg.type === "continent" && reg.id === st.continent;
          if (match && c.burg === 0) {
            cell = c;
            break;
          }
        }
      }
      if (!cell) continue;

      const isCapital = bDef.name === st.capital;
      cell.burg = burgId;
      cell.state = st.i;
      cell.culture = st.culture;
      cell.religion = st.religion;

      if (isCapital) {
        stateCenters[st.i] = cell.i;
        const stateObj = map.pack.states.find((s) => s.i === st.i);
        if (stateObj) {
          stateObj.capital = burgId;
          stateObj.center = cell.i;
          stateObj.pole = [cell.p[0], cell.p[1]];
        }
      }

      burgs.push({
        i: burgId,
        name: bDef.name,
        cell: cell.i,
        x: cell.p[0],
        y: cell.p[1],
        state: st.i,
        culture: st.culture,
        feature: cell.f,
        capital: isCapital ? 1 : 0,
        port: bDef.port ?? 0,
        population: bDef.pop,
        type: bDef.type ?? "Generic",
        coa: simpleCoa(),
        citadel: isCapital ? 1 : 0,
        walls: isCapital ? 1 : 0,
        temple: 1,
        plaza: isCapital ? 1 : 0,
        group: isCapital ? "capital" : "town",
      });
      burgId++;
    }
  }

  // Asignar state/culture/religion a celdas de tierra por región
  for (const cell of cells) {
    if (cell.h < 20) continue;
    const reg = regionAt(cell.p[0], cell.p[1]);
    if (reg.type === "ocean") continue;

    let st = null;
    if (reg.type === "island") st = STATE_DEFS.find((s) => s.island === reg.id);
    else {
      const options = STATE_DEFS.filter((s) => s.continent === reg.id);
      st = options[Math.floor((cell.p[1] / HEIGHT) * options.length) % options.length] ?? options[0];
    }
    if (!st || st.neutral) continue;
    if (cell.burg === 0) {
      cell.state = st.i;
      cell.culture = st.culture;
      cell.religion = st.religion;
    }
  }

  map.pack.burgs = burgs;

  // Culturas y religiones
  map.pack.cultures = CULTURES.map((c) => ({
    name: c.name,
    i: c.i,
    base: c.base,
    origins: c.origins ?? [0],
    shield: "heater",
    type: c.type ?? "Generic",
  }));

  map.pack.religions = RELIGIONS.map((r) => ({
    name: r.name,
    i: r.i,
    origins: r.origins ?? [0],
  }));

  // Provincias (una por estado activo)
  map.pack.provinces = [
    0,
    ...activeStates.map((s, idx) => ({
      i: idx + 1,
      state: s.i,
      center: stateCenters[s.i] ?? 0,
      burg: map.pack.states.find((st) => st.i === s.i)?.capital ?? 0,
      name: s.name,
      formName: s.formName ?? "Province",
      fullName: `${s.name} ${s.formName ?? "Province"}`,
      color: s.color,
      coa: simpleCoa(),
    })),
  ];

  // Ríos simplificados entre burgos principales
  map.pack.rivers = (map.pack.rivers ?? []).slice(0, 8).map((r, i) => ({
    ...r,
    name: ["Río de las Lágrimas", "Río Sol", "Río Concordia", "Río Umbral", "Río Nimrael", "Río Drakon", "Río Selva", "Río Lex"][i] ?? r.name,
  }));

  // Marcadores con leyenda en notes
  const markerNotes = MARKERS.map((m, i) => {
    const near = cells
      .filter((c) => c.h >= 20)
      .sort((a, b) => dist(a.p[0], a.p[1], m.x, m.y) - dist(b.p[0], b.p[1], m.x, m.y))[0];
    return {
      icon: m.icon,
      type: m.type,
      x: m.x,
      y: m.y,
      cell: near?.i ?? 0,
      i,
      name: m.name,
    };
  });
  map.pack.markers = markerNotes;

  map.notes = [
    ...NOTES,
    ...MARKERS.map((m) => ({
      id: `marker-${m.name.replace(/\s+/g, "-").toLowerCase()}`,
      name: m.name,
      legend: m.legend,
    })),
  ];

  // Zonas de conflicto / diplomacia
  map.pack.zones = [
    {
      i: 0,
      name: "Guerra de Korthaven",
      type: "War",
      cells: cells.filter((c) => c.state >= 1 && c.state <= 3).slice(0, 40).map((c) => c.i),
      color: "url(#hatch1)",
    },
    {
      i: 1,
      name: "Proselytism de Pholtus",
      type: "Proselytism",
      cells: cells.filter((c) => c.state >= 7 && c.state <= 9).slice(0, 30).map((c) => c.i),
      color: "url(#hatch6)",
    },
    {
      i: 2,
      name: "Plaga del Olvido",
      type: "Disease",
      cells: cells.filter((c) => c.state >= 4 && c.state <= 6).slice(0, 20).map((c) => c.i),
      color: "url(#hatch12)",
    },
  ];

  // Limpiar datos económicos masivos del template (deals)
  map.pack.deals = [];
  map.pack.markets = [];
  map.pack.routes = (map.pack.routes ?? []).slice(0, 50);

  // Simplificar burgs production del template
  for (const b of map.pack.burgs) {
    if (b.production) b.production = [];
  }

  return map;
}

function main() {
  const defaultOut = join(root, "maps", "Valtherion.json");
  const out = process.argv[2] ?? defaultOut;
  mkdirSync(dirname(out), { recursive: true });

  console.log("[valtherion] Generando mapa de Valtherion...");
  const template = loadTemplate();
  const map = buildMap(template);

  writeFileSync(out, JSON.stringify(map));
  const mb = (Buffer.byteLength(JSON.stringify(map)) / 1024 / 1024).toFixed(2);
  console.log(`[valtherion] Mapa exportado: ${out} (${mb} MB)`);
  console.log(`[valtherion] Estados: ${map.pack.states.length - 1}, Burgs: ${map.pack.burgs.length - 1}`);
  console.log("[valtherion] Importá el archivo en Azgaar → Load → Import desde JSON");
}

main();
