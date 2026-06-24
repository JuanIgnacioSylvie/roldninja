import { r } from "./helpers";

function species(
  id: string,
  titleEn: string,
  titleEs: string,
  bodyEn: string,
  bodyEs: string,
) {
  return r({
    id,
    kind: "species",
    category: "species",
    titleEn,
    titleEs,
    summaryEn: "Species traits",
    summaryEs: "Rasgos de especie",
    bodyEn,
    bodyEs,
    tags: ["species", titleEn.toLowerCase(), titleEs.toLowerCase()],
    manual: "phb",
  });
}

export const SPECIES_ES_ENTRIES = [
  species(
    "aasimar",
    "Aasimar",
    "Aasimar",
    "Humanoid · Medium or Small · Speed 30 ft.\n\nCelestial Resistance — Resistance to Necrotic and Radiant.\nDarkvision — 60 ft.\nHealing Hands — Magic action: touch creature, roll PB d4s healing (Long Rest).\nLight Bearer — Light cantrip (CHA).\nCelestial Revelation (level 3) — Bonus Action transform 1 min: Heavenly Wings (fly = Speed), Inner Radiance (10-ft. bright light + Radiant to nearby foes), or Necrotic Shroud (Frightened CHA save). Extra PB damage once/turn on hit. Long Rest.",
    "Humanoide · Mediano o Pequeño · Velocidad 9 m.\n\nResistencia celestial — Resistencia al Necrótico y Radiante.\nVisión en la oscuridad — 18 m.\nManos sanadoras — Acción mágica: tocar criatura, tira PB d4 de curación (Descanso largo).\nPortador de luz — Truco Luz (CAR).\nRevelación celestial (nivel 3) — Acción adicional, forma 1 min: Alas celestiales (vuelo), Resplandor interior (luz + Radiante) o Velo necrótico (salvación CAR o Asustado). Daño extra = competencia una vez/turno. Descanso largo.",
  ),
  species(
    "dragonborn",
    "Dragonborn",
    "Dracónido",
    "Humanoid · Medium · Speed 30 ft.\n\nDraconic Ancestry — Choose dragon type (Black/Acid, Blue/Lightning, Brass/Fire, Bronze/Lightning, Copper/Acid, Gold/Fire, Green/Poison, Red/Fire, Silver/Cold, White/Cold).\nBreath Weapon — On Attack action, 15-ft. Cone or 30-ft. Line (5 ft. wide): DEX save or 1d10 damage (scales at 5/11/17). PB uses per Long Rest.\nDamage Resistance — Matching ancestry type.\nDarkvision — 60 ft.\nDraconic Flight (level 5) — Bonus Action spectral wings, Fly Speed = Speed, 10 min. Long Rest.",
    "Humanoide · Mediano · Velocidad 9 m.\n\nAscendencia dracónica — Elige dragón (Negro/Ácido, Azul/Relámpago, Latón/Fuego, etc.).\nAliento — Con acción Atacar, cono 4,5 m o línea 9 m: salvación DES o 1d10 (escala en 5/11/17). Usos = competencia por Descanso largo.\nResistencia al daño — Según ascendencia.\nVisión en la oscuridad — 18 m.\nVuelo dracónico (nivel 5) — Acción adicional, alas espectrales, vuelo = Velocidad, 10 min. Descanso largo.",
  ),
  species(
    "dwarf",
    "Dwarf",
    "Enano",
    "Humanoid · Medium · Speed 30 ft.\n\nDarkvision — 120 ft.\nDwarven Resilience — Resistance to Poison; Advantage on saves vs. Poisoned.\nDwarven Toughness — +1 HP per level.\nStonecunning — Bonus Action Tremorsense 60 ft. for 10 min on stone (PB uses per Long Rest).",
    "Humanoide · Mediano · Velocidad 9 m.\n\nVisión en la oscuridad — 36 m.\nResiliencia enana — Resistencia al veneno; ventaja en salvaciones contra Envenenado.\nRobustez enana — +1 PG por nivel.\nSentido de la piedra — Acción adicional, sentido sísmico 18 m 10 min en piedra (usos = competencia por Descanso largo).",
  ),
  species(
    "elf",
    "Elf",
    "Elfo",
    "Humanoid · Medium · Speed 30 ft.\n\nDarkvision — 60 ft. (120 ft. Drow).\nElven Lineage — Drow (Faerie Fire, Darkness), High Elf (Prestidigitation + Wizard cantrip swap), or Wood Elf (+5 ft. Speed, Druidcraft).\nFey Ancestry — Advantage vs. Charmed.\nKeen Senses — Proficiency in Insight, Perception, or Survival.\nTrance — 4-hour Long Rest; immune to magical sleep.",
    "Humanoide · Mediano · Velocidad 9 m.\n\nVisión en la oscuridad — 18 m (36 m drow).\nLinaje élfico — Drow (Luz feérica, Oscuridad), Alto elfo (Prestidigitación + truco de mago), Elfo del bosque (+1,5 m Velocidad, Druidecraft).\nAscendencia feérica — Ventaja vs. Hechizado.\nSentidos agudos — Competencia en Perspicacia, Percepción o Supervivencia.\nTrance — Descanso largo en 4 h; inmune al sueño mágico.",
  ),
  species(
    "gnome",
    "Gnome",
    "Gnomo",
    "Humanoid · Small · Speed 30 ft.\n\nDarkvision — 60 ft.\nGnomish Cunning — Advantage on INT, WIS, CHA saves.\nGnomish Lineage — Forest Gnome (Minor Illusion, Speak with Animals PB/Long Rest) or Rock Gnome (Mending, Prestidigitation, clockwork devices).",
    "Humanoide · Pequeño · Velocidad 9 m.\n\nVisión en la oscuridad — 18 m.\nAstucia gnómica — Ventaja en salvaciones de INT, SAB y CAR.\nLinaje gnómico — Gnomo del bosque (Ilusión menor, Hablar con animales) o Gnomo de las rocas (Reparar, Prestidigitación, artilugios).",
  ),
  species(
    "goliath",
    "Goliath",
    "Goliat",
    "Humanoid · Medium · Speed 35 ft.\n\nGiant Ancestry — PB/Long Rest: Cloud's Jaunt (teleport 30 ft.), Fire's Burn (+1d10 Fire on hit), Frost's Chill (+1d6 Cold, −10 ft. Speed), Hill's Tumble (Prone on hit), Stone's Endurance (reduce damage d12+CON), or Storm's Thunder (1d8 Thunder reaction).\nLarge Form (level 5) — Bonus Action Large 10 min: Advantage STR checks, +10 ft. Speed. Long Rest.\nPowerful Build — Advantage to end Grappled; count as Large for carrying.",
    "Humanoide · Mediano · Velocidad 10,5 m.\n\nAscendencia gigante — Usos = competencia: teletransporte nube, quemadura fuego, frío escarcha, caída colina, resistencia piedra o trueno tormenta.\nForma grande (nivel 5) — Acción adicional, Grande 10 min: ventaja FUE, +3 m Velocidad. Descanso largo.\nComplexión poderosa — Ventaja para escapar Agarrado; cuenta como Grande para carga.",
  ),
  species(
    "halfling",
    "Halfling",
    "Mediano",
    "Humanoid · Small · Speed 30 ft.\n\nBrave — Advantage vs. Frightened.\nHalfling Nimbleness — Move through larger creatures' spaces (can't stop there).\nLuck — Reroll natural 1 on d20 Tests (must use new roll).\nNaturally Stealthy — Hide when obscured only by a larger creature.",
    "Humanoide · Pequeño · Velocidad 9 m.\n\nValiente — Ventaja vs. Asustado.\nAgilidad mediana — Atraviesas espacios de criaturas más grandes (no puedes parar ahí).\nSuerte — Repite un 1 natural en Tiradas d20.\nSigilo natural — Puedes Esconderte tras una criatura más grande.",
  ),
  species(
    "human",
    "Human",
    "Humano",
    "Humanoid · Medium or Small · Speed 30 ft.\n\nResourceful — Heroic Inspiration after each Long Rest.\nSkillful — One skill proficiency.\nVersatile — One Origin feat (Skilled recommended).",
    "Humanoide · Mediano o Pequeño · Velocidad 9 m.\n\nIngenio — Inspiración heroica tras cada Descanso largo.\nHabilidoso — Competencia en una habilidad.\nVersátil — Una dote de origen (se recomienda Habilidoso).",
  ),
  species(
    "orc",
    "Orc",
    "Orco",
    "Humanoid · Medium · Speed 30 ft.\n\nAdrenaline Rush — Bonus Action Dash; gain PB Temp HP (PB/Long Rest).\nDarkvision — 120 ft.\nRelentless Endurance — Drop to 1 HP instead of 0 once per Long Rest.",
    "Humanoide · Mediano · Velocidad 9 m.\n\nRush de adrenalina — Acción adicional Correr; ganas PG temporales = competencia (usos = competencia por Descanso largo).\nVisión en la oscuridad — 36 m.\nAguante implacable — A 0 PG quedas a 1 PG una vez por Descanso largo.",
  ),
  species(
    "tiefling",
    "Tiefling",
    "Tiefling",
    "Humanoid · Medium or Small · Speed 30 ft.\n\nDarkvision — 60 ft.\nFiendish Legacy — Abyssal (Poison resist, Poison Spray; level 3 Ray of Sickness, level 5 Hold Person), Chthonic (Necrotic resist, Chill Touch; False Life, Ray of Enfeeblement), or Infernal (Fire resist, Fire Bolt; Hellish Rebuke, Darkness).\nOtherworldly Presence — Thaumaturgy cantrip.",
    "Humanoide · Mediano o Pequeño · Velocidad 9 m.\n\nVisión en la oscuridad — 18 m.\nLegado infernal — Abisal (veneno), Ctónico (necrótico) o Infernal (fuego): truco, resistencia y conjuros en niveles 3 y 5.\nPresencia sobrenatural — Truco Taumaturgia.",
  ),
];
