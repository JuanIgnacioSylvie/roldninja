/** Utilidades para obtener textos de monstruos del SRD 5.1 en español (Nosolorol). */

const NOSOLOROL_BASE = "https://srd.nosolorol.com/DD5/";

/** slug Open5e → ruta Nosolorol cuando no coincide el nombre en monster-names-es.json */
export const NOSOLOROL_SLUG_PATHS = {
  aboleth: "monstruos/abolez.html",
  androsphinx: "monstruos/androesfinge.html",
  "animated-armor": "monstruos/armadura_animada.html",
  "awakened-shrub": "animales/arbusto_consciente.html",
  "awakened-tree": "animales/Árbol_consciente.html",
  ape: "animales/simio.html",
  archmage: "PNJs/archimago.html",
  "brown-bear": "animales/oso_pardo.html",
  cloaker: "monstruos/manto.html",
  darkmantle: "monstruos/mantoscuro.html",
  "deep-gnome-svirfneblin": "monstruos/gnomo_de_las_profundidades_(svirfneblin).html",
  "dire-wolf": "animales/lobo_terrible.html",
  "dragon-turtle": "monstruos/dragon_tortuga.html",
  drider: "monstruos/draña.html",
  dryad: "monstruos/driada.html",
  "dust-mephit": "monstruos/mefit_de_polvo.html",
  efreeti: "monstruos/ifriti.html",
  erinyes: "monstruos/erinia.html",
  "gelatinous-cube": "monstruos/cubo_gelatinoso.html",
  ghoul: "monstruos/necrofago.html",
  "gibbering-mouther": "monstruos/gibado.html",
  gladiator: "PNJs/gladiador.html",
  goblin: "monstruos/trasgo.html",
  grimlock: "monstruos/grimorlock.html",
  "guardian-naga": "monstruos/naga_guardiana.html",
  gynosphinx: "monstruos/ginoesfinge.html",
  "half-red-dragon-veteran": "monstruos/semidragon_rojo_veterano.html",
  "hell-hound": "monstruos/can_del_infierno.html",
  "hill-giant": "monstruos/gigante_de_las_colinas.html",
  hobgoblin: "monstruos/osgo.html",
  "horned-devil": "monstruos/diablo_astado.html",
  "killer-whale": "animales/ballena_asesina.html",
  lemure: "monstruos/lemur.html",
  lich: "monstruos/liche.html",
  magmin: "monstruos/magmino.html",
  mimic: "monstruos/mimeto.html",
  "minotaur-skeleton": "monstruos/esqueleto_de_minotauro.html",
  "night-hag": "monstruos/saga_nocturna.html",
  "ogre-zombie": "monstruos/ogro_zombi.html",
  "pit-fiend": "monstruos/balor.html",
  planetar: "monstruos/planotareo.html",
  quipper: "animales/piraña.html",
  "riding-horse": "animales/caballo_de_monta.html",
  "rug-of-smothering": "monstruos/alfombra_de_asfixiar.html",
  "sea-hag": "monstruos/saga_marina.html",
  shrieker: "monstruos/hongo_chillon.html",
  "spirit-naga": "monstruos/naga_espiritual.html",
  "storm-giant": "monstruos/gigante_de_la_tormenta.html",
  succubusincubus: "monstruos/sucubo_incubo.html",
  "swarm-of-beetles": "animales/enjambre_de_insectos.html",
  "swarm-of-centipedes": "animales/enjambre_de_insectos.html",
  "swarm-of-quippers": "animales/enjambre_de_pirañas.html",
  "swarm-of-spiders": "animales/enjambre_de_insectos.html",
  "swarm-of-wasps": "animales/enjambre_de_insectos.html",
  tarrasque: "monstruos/tarasca.html",
  treant: "monstruos/ent.html",
  warhorse: "animales/caballo_de_guerra.html",
  "warhorse-skeleton": "monstruos/esqueleto_de_caballo_de_guerra.html",
  wight: "monstruos/tumulario.html",
  worg: "animales/huargo.html",
  wraith: "monstruos/espectro.html",
  "young-copper-dragon": "monstruos/dragon_de_cobre_joven.html",
  "axe-beak": "animales/hachapico.html",
  baboon: "animales/babuino.html",
  badger: "animales/tejon.html",
  bandit: "PNJs/bandido.html",
  "bandit-captain": "PNJs/capitan_bandido.html",
  "barbed-devil": "monstruos/diablo_punzante.html",
  berserker: "PNJs/berserker.html",
  "black-bear": "animales/oso_negro.html",
  "black-dragon-wyrmling": "monstruos/dragon_negro_sierpe.html",
  "black-pudding": "monstruos/pudin_negro.html",
  "blink-dog": "animales/perro_intermitente.html",
  "blue-dragon-wyrmling": "monstruos/dragon_azul_sierpe.html",
  "bone-devil": "monstruos/diablo_oseo.html",
  "brass-dragon-wyrmling": "monstruos/dragon_de_bronce_sierpe.html",
  "bronze-dragon-wyrmling": "monstruos/dragon_de_bronce_sierpe.html",
  bugbear: "monstruos/gran_trasgo.html",
  bulette: "monstruos/bulete.html",
  "chain-devil": "monstruos/diablo_de_la_cadena.html",
  chuul: "monstruos/khuul.html",
  cockatrice: "monstruos/cocatriz.html",
  commoner: "PNJs/plebeyo.html",
  "constrictor-snake": "animales/serpiente_constrictora.html",
  "copper-dragon-wyrmling": "monstruos/dragon_de_cobre_sierpe.html",
  "cult-fanatic": "PNJs/fanatico_de_una_secta.html",
  cultist: "PNJs/sectario.html",
  "draft-horse": "animales/caballo_de_tiro.html",
  druid: "PNJs/druida.html",
  duergar: "monstruos/duergar.html",
  eagle: "animales/aguila.html",
  "earth-elemental": "monstruos/elemental_de_tierra.html",
  "fire-elemental": "monstruos/elemental_de_fuego.html",
  "flying-sword": "monstruos/espada_voladora.html",
  "giant-badger": "animales/tejon_gigante.html",
  "giant-bat": "animales/murcielago_gigante.html",
  "giant-centipede": "animales/ciempies_gigante.html",
  "giant-crab": "animales/cangrejo_gigante.html",
  "giant-frog": "animales/rana_gigante.html",
  "giant-goat": "animales/cabra_gigante.html",
  "giant-hyena": "animales/hiena_gigante.html",
  "giant-lizard": "animales/lagarto_gigante.html",
  "giant-octopus": "animales/pulpo_gigante.html",
  "giant-owl": "animales/buho_gigante.html",
  "giant-poisonous-snake": "animales/serpiente_venenosa_gigante.html",
  "giant-rat": "animales/rata_gigante.html",
  "giant-scorpion": "animales/escorpion_gigante.html",
  "giant-seahorse": "animales/caballito_de_mar_gigante.html",
  "giant-shark": "animales/tiburon_gigante.html",
  "giant-spider": "animales/araña_gigante.html",
  "giant-toad": "animales/sapo_gigante.html",
  "giant-vulture": "animales/buitre_gigante.html",
  "giant-wasp": "animales/avispa_gigante.html",
  "giant-weasel": "animales/comadreja_gigante.html",
  "giant-wolf-spider": "animales/araña_lobo_gigante.html",
  "gold-dragon-wyrmling": "monstruos/dragon_de_oro_sierpe.html",
  "green-dragon-wyrmling": "monstruos/dragon_verde_sierpe.html",
  grick: "monstruos/gric.html",
  hippogriff: "monstruos/hipogrifo.html",
  homunculus: "monstruos/homunculo.html",
  "ice-devil": "monstruos/diablo_gelido.html",
  "ice-mephit": "monstruos/mefit_de_hielo.html",
  "invisible-stalker": "monstruos/acechador_invisible.html",
  knight: "PNJs/caballero.html",
  "magma-mephit": "monstruos/mefit_de_magma.html",
  manticore: "monstruos/manticora.html",
  merfolk: "monstruos/sirenio.html",
  "mummy-lord": "monstruos/señor_de_las_momias.html",
  noble: "PNJs/noble.html",
  "ochre-jelly": "monstruos/gelatina_ocre.html",
  "phase-spider": "animales/araña_de_fase.html",
  priest: "PNJs/sacerdote.html",
  pseudodragon: "monstruos/pseudodragon.html",
  "red-dragon-wyrmling": "monstruos/dragon_rojo_sierpe.html",
  "rust-monster": "monstruos/monstruo_corrosivo.html",
  scout: "PNJs/explorador.html",
  "silver-dragon-wyrmling": "monstruos/dragon_de_plata_sierpe.html",
  spy: "PNJs/espia.html",
  "steam-mephit": "monstruos/mefit_de_vapor.html",
  thug: "PNJs/maton.html",
  "twig-blight": "monstruos/broza_movediza.html",
  "vampire-spawn": "monstruos/engendro_vampirico.html",
  "violet-fungus": "monstruos/hongo_violaceo.html",
  "water-elemental": "monstruos/elemental_de_agua.html",
  werebear: "monstruos/hombre_oso.html",
  wereboar: "monstruos/hombre_jabali.html",
  wererat: "monstruos/hombre_rata.html",
  weretiger: "monstruos/hombre_tigre.html",
  werewolf: "monstruos/hombre_lobo.html",
  "white-dragon-wyrmling": "monstruos/dragon_blanco_sierpe.html",
  "winter-wolf": "animales/lobo_de_invierno.html",
};

const DRAGON_AGE = {
  ancient: "antiguo",
  adult: "adulto",
  young: "joven",
  wyrmling: "sierpe",
};

const DRAGON_COLOR = {
  black: "negro",
  blue: "azul",
  brass: "de_bronce",
  bronze: "de_bronce",
  copper: "de_cobre",
  gold: "de_oro",
  green: "verde",
  red: "rojo",
  silver: "de_plata",
  white: "blanco",
};

export function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]/g, "");
}

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function cleanText(text) {
  return decodeHtml(text).replace(/\s+/g, " ").trim();
}

function extractAbilityName(raw) {
  return cleanText(raw).replace(/[.:]+$/, "").replace(/\s+/g, " ");
}

export async function fetchNosolorolIndex() {
  const res = await fetch(`${NOSOLOROL_BASE}bestiario_index.html`);
  if (!res.ok) throw new Error(`Nosolorol index HTTP ${res.status}`);
  const html = await res.text();
  const byNorm = new Map();
  const byPath = new Map();
  const re = /<option value="([^"]+)">([^<]+)<\/option>/g;
  let m;
  while ((m = re.exec(html))) {
    const path = m[1].replace(/^\.\//, "");
    if (!/^(PNJs|animales|monstruos)\//i.test(path)) continue;
    const entry = { path, name: cleanText(m[2]) };
    byNorm.set(normalizeName(entry.name), entry);
    byPath.set(path.toLowerCase(), entry);
  }
  return { byNorm, byPath };
}

export function resolveNosolorolPathForSlug(slug, nameEs, index) {
  const override = NOSOLOROL_SLUG_PATHS[slug];
  if (override && index.byPath.has(override.toLowerCase())) return override;

  const byName = index.byNorm.get(normalizeName(nameEs));
  if (byName) return byName.path;

  const ancient = slug.match(/^ancient-(.+)-dragon$/);
  if (ancient && DRAGON_COLOR[ancient[1]]) {
    const path = `monstruos/dragon_${DRAGON_COLOR[ancient[1]]}_antiguo.html`;
    if (index.byPath.has(path.toLowerCase())) return path;
  }

  const adult = slug.match(/^adult-(.+)-dragon$/);
  if (adult && DRAGON_COLOR[adult[1]]) {
    const path = `monstruos/dragon_${DRAGON_COLOR[adult[1]]}_adulto.html`;
    if (index.byPath.has(path.toLowerCase())) return path;
  }

  const young = slug.match(/^young-(.+)-dragon$/);
  if (young && DRAGON_COLOR[young[1]]) {
    const path = `monstruos/dragon_${DRAGON_COLOR[young[1]]}_joven.html`;
    if (index.byPath.has(path.toLowerCase())) return path;
  }

  const wyrmling = slug.match(/^(.+)-dragon-wyrmling$/);
  if (wyrmling && DRAGON_COLOR[wyrmling[1]]) {
    const path = `monstruos/dragon_${DRAGON_COLOR[wyrmling[1]]}_sierpe.html`;
    if (index.byPath.has(path.toLowerCase())) return path;
  }

  const underscored = slug.replace(/-/g, "_");
  for (const candidate of [
    `PNJs/${underscored}.html`,
    `animales/${underscored}.html`,
    `monstruos/${underscored}.html`,
  ]) {
    if (index.byPath.has(candidate.toLowerCase())) return candidate;
  }

  return null;
}

function findSectionStart(html, label) {
  const re = new RegExp(`<b>\\s*${label}:?\\s*<\\/b>`, "i");
  return html.search(re);
}

function sliceSection(html, startLabel, endLabels) {
  const start = findSectionStart(html, startLabel);
  if (start < 0) return "";
  let end = html.length;
  for (const label of endLabels) {
    const idx = findSectionStart(html.slice(start + 1), label);
    if (idx >= 0) end = Math.min(end, start + 1 + idx);
  }
  return html.slice(start, end);
}

function parseAbilityBlocks(sectionHtml) {
  const blocks = [];
  const parts = sectionHtml.split(/<p[^>]*>/i).slice(1);
  for (const part of parts) {
    const chunk = part.split(/<\/p>/i)[0];
    if (!chunk.trim()) continue;

    const titled =
      chunk.match(/<i>\s*<b>([\s\S]*?)<\/b>\s*<\/i>/i) ?? chunk.match(/<b>([\s\S]*?)<\/b>/i);
    if (!titled) {
      if (blocks.length) {
        blocks[blocks.length - 1].text += " " + cleanText(chunk.replace(/<[^>]+>/g, " "));
      }
      continue;
    }

    const name = extractAbilityName(titled[1]);
    const descHtml = chunk.replace(titled[0], "");
    const text = cleanText(descHtml.replace(/<[^>]+>/g, " "));
    if (name) blocks.push({ name, text });
  }
  return blocks;
}

export function parseNosolorolMonsterHtml(html) {
  const traitsSection = sliceSection(html, "Desafío", ["Acciones", "Acciones legendarias"]);
  const actionsSection = sliceSection(html, "Acciones", ["Acciones legendarias", "Reacciones"]);
  const crIdx = findSectionStart(traitsSection, "Desafío");
  const traitsHtml =
    crIdx >= 0 ? traitsSection.slice(crIdx).replace(/^[\s\S]*?<\/p>/i, "") : traitsSection;

  return {
    traits: parseAbilityBlocks(traitsHtml),
    actions: parseAbilityBlocks(actionsSection),
  };
}

const pageCache = new Map();

export async function fetchNosolorolMonsterTexts(path) {
  if (!path) return null;
  if (pageCache.has(path)) return pageCache.get(path);

  const res = await fetch(`${NOSOLOROL_BASE}${path}`);
  if (!res.ok) {
    pageCache.set(path, null);
    return null;
  }
  const html = await res.text();
  const parsed = parseNosolorolMonsterHtml(html);
  pageCache.set(path, parsed);
  return parsed;
}

export function mergeAbilityLists(enList, esList) {
  if (!Array.isArray(enList) || enList.length === 0) return [];
  return enList.map((entry, i) => {
    const es = esList?.[i];
    return {
      name: entry.name,
      text: entry.text,
      nameEs: es?.name ?? entry.name,
      textEs: es?.text ?? entry.text,
    };
  });
}
