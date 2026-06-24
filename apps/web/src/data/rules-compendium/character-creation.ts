import { r } from "./helpers";

export const CHARACTER_CREATION_RULES = [
  r({
    id: "character-creation-overview",
    kind: "rule",
    category: "checks",
    titleEn: "Creating a Character",
    titleEs: "Crear un personaje",
    summaryEn: "Choose class, species, background, and ability scores.",
    summaryEs: "Elige clase, especie, trasfondo y características.",
    bodyEn:
      "1. Choose a class (chapter 3).\n2. Choose a species and background (chapter 4).\n3. Determine ability scores: Standard Array (15, 14, 13, 12, 10, 8), Point Buy, or rolling.\n4. Choose skills, tools, and equipment from your background and class.\n5. Choose spells if your class is a spellcaster.\n6. Name your character and describe their appearance and personality.",
    bodyEs:
      "1. Elige una clase (capítulo 3).\n2. Elige especie y trasfondo (capítulo 4).\n3. Determina características: array estándar (15, 14, 13, 12, 10, 8), compra por puntos o tiradas.\n4. Elige habilidades, herramientas y equipo de tu trasfondo y clase.\n5. Elige conjuros si tu clase conjura.\n6. Pon nombre a tu personaje y describe su aspecto y personalidad.",
    tags: ["character", "creation"],
    manual: "phb",
  }),
  r({
    id: "ability-score-standard-array",
    kind: "rule",
    category: "checks",
    titleEn: "Standard Array",
    titleEs: "Array estándar",
    summaryEn: "Assign 15, 14, 13, 12, 10, and 8 to your six abilities.",
    summaryEs: "Asigna 15, 14, 13, 12, 10 y 8 a tus seis características.",
    bodyEn:
      "Assign these six scores to Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma as you choose: 15, 14, 13, 12, 10, 8.",
    bodyEs:
      "Asigna estas seis puntuaciones a Fuerza, Destreza, Constitución, Inteligencia, Sabiduría y Carisma como quieras: 15, 14, 13, 12, 10, 8.",
    tags: ["ability scores", "creation"],
    manual: "phb",
  }),
  r({
    id: "starting-equipment-gold",
    kind: "rule",
    category: "checks",
    titleEn: "Starting Equipment or Gold",
    titleEs: "Equipo inicial u oro",
    summaryEn: "Take class/background packages or roll starting gold.",
    summaryEs: "Toma los paquetes de clase/trasfondo o tira oro inicial.",
    bodyEn:
      "Your class and background provide starting equipment packages (option A or B). Instead, you may take starting gold based on your class and roll for extra gear (see class tables).",
    bodyEs:
      "Tu clase y trasfondo ofrecen paquetes de equipo (opción A o B). En su lugar, puedes tomar oro inicial según tu clase y tirar por equipo extra (ver tablas de clase).",
    tags: ["equipment", "creation"],
    manual: "phb",
  }),
  r({
    id: "ability-score-point-buy",
    kind: "rule",
    category: "checks",
    titleEn: "Ability Score Point Buy",
    titleEs: "Compra por puntos de características",
    summaryEn: "Spend 27 points on scores; costs range from 0 (8) to 9 (15).",
    summaryEs: "Gasta 27 puntos en puntuaciones; costes de 0 (8) a 9 (15).",
    bodyEn:
      "You have 27 points to spend on ability scores. Costs:\n\n8 → 0 | 9 → 2 | 10 → 3 | 11 → 4 | 12 → 5 | 13 → 6 | 14 → 7 | 15 → 9\n\nYou can't buy a score above 15 with this method. Assign the six results to your abilities, then record modifiers.",
    bodyEs:
      "Tienes 27 puntos para gastar en características. Costes:\n\n8 → 0 | 9 → 2 | 10 → 3 | 11 → 4 | 12 → 5 | 13 → 6 | 14 → 7 | 15 → 9\n\nNo puedes comprar una puntuación superior a 15 con este método. Asigna los seis resultados y anota los modificadores.",
    tags: ["ability scores", "point buy", "creation"],
    related: ["ability-score-standard-array", "ability-modifiers"],
    manual: "phb",
  }),
  r({
    id: "ability-score-rolling",
    kind: "rule",
    category: "checks",
    titleEn: "Rolling Ability Scores",
    titleEs: "Tirar características",
    summaryEn: "Roll 4d6, drop lowest, six times; assign to abilities.",
    summaryEs: "Tira 4d6, descarta el menor, seis veces; asigna a características.",
    bodyEn:
      "Roll four d6s and record the total of the highest three dice. Repeat five more times for six numbers. Assign them to Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma as you choose.",
    bodyEs:
      "Tira cuatro d6 y anota el total de los tres dados más altos. Repite cinco veces más para obtener seis números. Asígnalos a Fuerza, Destreza, Constitución, Inteligencia, Sabiduría y Carisma como quieras.",
    tags: ["ability scores", "rolling", "creation"],
    related: ["ability-score-standard-array", "ability-score-point-buy"],
    manual: "phb",
  }),
  r({
    id: "gaining-levels",
    kind: "rule",
    category: "checks",
    titleEn: "Gaining a Level",
    titleEs: "Subir de nivel",
    summaryEn: "Increase HP, Hit Dice, class features; ASI or feat at certain levels.",
    summaryEs: "Aumenta PG, Dados de Golpe, rasgos de clase; MEJ o dote en niveles concretos.",
    bodyEn:
      "When you gain a level in a class:\n\n• Increase maximum HP by Hit Die average (or roll) + Constitution modifier (minimum +1 per level).\n• Gain one Hit Die of that class's type.\n• Gain class features for that level.\n\nAt levels 4, 8, 12, 16, and 19 (most classes), choose an Ability Score Improvement (+2 to one ability or +1 to two) or a qualifying feat instead.\n\nXP thresholds use total character level, not single-class level.",
    bodyEs:
      "Al ganar un nivel en una clase:\n\n• Aumenta PG máximos por media del Dado de Golpe (o tirada) + modificador de Constitución (mínimo +1 por nivel).\n• Ganas un Dado de Golpe de ese tipo.\n• Obtienes rasgos de clase de ese nivel.\n\nEn niveles 4, 8, 12, 16 y 19 (la mayoría de clases), eliges Mejora de características (+2 a una o +1 a dos) o una dote válida.\n\nLos umbrales de PX usan el nivel total del personaje, no el de una sola clase.",
    tags: ["leveling", "asi", "hit dice"],
    related: ["multiclassing-overview", "long-rest"],
    manual: "phb",
  }),
];

export const MULTICLASS_RULES = [
  r({
    id: "multiclassing-overview",
    kind: "rule",
    category: "checks",
    titleEn: "Multiclassing",
    titleEs: "Multiclasificación",
    summaryEn: "Gain levels in multiple classes with prerequisites.",
    summaryEs: "Gana niveles en varias clases con requisitos previos.",
    bodyEn:
      "When you gain a level, you can take a level in a new class if you meet its prerequisites (usually minimum ability scores). You add half your levels (rounded down) in certain classes when determining spell slots for full casters.\n\nYou gain some but not all starting proficiencies of the new class. See Multiclass Proficiencies and Multiclass Spellcasting entries.",
    bodyEs:
      "Al subir de nivel, puedes tomar un nivel en una clase nueva si cumples sus requisitos (suele ser una puntuación mínima de característica). Sumas la mitad de tus niveles (redondeado hacia abajo) en ciertas clases al calcular espacios de conjuro de lanzadores completos.\n\nGanas algunas competencias iniciales de la nueva clase, pero no todas. Consulta Competencias de multiclasificación y Conjuros de multiclasificación.",
    tags: ["multiclass", "leveling"],
    related: ["multiclass-prerequisites", "multiclass-proficiencies", "multiclass-spellcasting"],
    manual: "phb",
  }),
  r({
    id: "multiclass-prerequisites",
    kind: "rule",
    category: "checks",
    titleEn: "Multiclass Prerequisites",
    titleEs: "Requisitos de multiclasificación",
    summaryEn: "Score 13+ in the primary ability of your current class(es) and the new class.",
    summaryEs: "Puntuación 13+ en la característica principal de tus clases actuales y la nueva.",
    bodyEn:
      "To qualify for a new class, you need at least 13 in that class's primary ability and in the primary ability of each class you already have.\n\nPrimary abilities:\n• Barbarian, Fighter, Paladin — Strength (Fighter also allows Dexterity 13+)\n• Bard, Sorcerer, Warlock — Charisma\n• Cleric, Druid, Ranger — Wisdom (Ranger also needs Dexterity 13+)\n• Monk — Dexterity and Wisdom\n• Rogue — Dexterity\n• Wizard — Intelligence",
    bodyEs:
      "Para una clase nueva necesitas al menos 13 en su característica principal y en la de cada clase que ya tengas.\n\nCaracterísticas principales:\n• Bárbaro, Guerrero, Paladín — Fuerza (Guerrero también permite Destreza 13+)\n• Bardo, Hechicero, Brujo — Carisma\n• Clérigo, Druida, Explorador — Sabiduría (Explorador también necesita Destreza 13+)\n• Monje — Destreza y Sabiduría\n• Pícaro — Destreza\n• Mago — Inteligencia",
    tags: ["multiclass", "prerequisites"],
    related: ["multiclassing-overview"],
    manual: "phb",
  }),
  r({
    id: "multiclass-proficiencies",
    kind: "rule",
    category: "checks",
    titleEn: "Multiclass Proficiencies",
    titleEs: "Competencias de multiclasificación",
    summaryEn: "First level in a new class grants only partial starting proficiencies.",
    summaryEs: "El primer nivel en una clase nueva solo concede competencias parciales.",
    bodyEn:
      "When you multiclass, you gain the Hit Point Die and limited proficiencies from the new class (not full starting packages):\n\n• Barbarian — Martial weapons, Shield training\n• Bard — 1 skill, 1 musical instrument, Light armor\n• Cleric — Light and Medium armor, Shields\n• Druid — Light armor, Shields (no Metal armor)\n• Fighter — Martial weapons, Light/Medium armor, Shields\n• Monk — Simple weapons, Light armor (if any), 1 Monk weapon\n• Paladin — Martial weapons, Light/Medium armor, Shields\n• Ranger — Medium armor, Shields, Martial weapons, 1 skill\n• Rogue — 1 skill, Thieves' Tools, Light armor\n• Sorcerer — no armor proficiencies\n• Warlock — Light armor\n• Wizard — no armor proficiencies\n\nYou also gain that class's level 1 features unless multiclass rules say otherwise.",
    bodyEs:
      "Al multiclasificar, ganas el Dado de Golpe y competencias limitadas de la nueva clase:\n\n• Bárbaro — Armas marciales, entrenamiento con escudo\n• Bardo — 1 habilidad, 1 instrumento, armadura ligera\n• Clérigo — Armadura ligera y media, escudos\n• Druida — Armadura ligera, escudos (sin metal)\n• Guerrero — Armas marciales, armadura ligera/media, escudos\n• Monje — Armas simples, 1 arma de monje\n• Paladín — Armas marciales, armadura ligera/media, escudos\n• Explorador — Armadura media, escudos, armas marciales, 1 habilidad\n• Pícaro — 1 habilidad, herramientas de ladrón, armadura ligera\n• Hechicero / Mago — sin armaduras\n• Brujo — armadura ligera\n\nTambién obtienes rasgos de nivel 1 salvo que las reglas de multiclasificación indiquen lo contrario.",
    tags: ["multiclass", "proficiencies"],
    related: ["multiclassing-overview"],
    manual: "phb",
  }),
  r({
    id: "multiclass-spellcasting",
    kind: "rule",
    category: "magic",
    titleEn: "Multiclass Spellcasting",
    titleEs: "Conjuros de multiclasificación",
    summaryEn: "Combine caster levels to determine shared spell slots.",
    summaryEs: "Combina niveles de lanzador para determinar espacios compartidos.",
    bodyEn:
      "If you have Spellcasting from more than one class, combine levels:\n\n• Full casters (Bard, Cleric, Druid, Sorcerer, Wizard): all levels count.\n• Half casters (Paladin, Ranger): half levels, round up.\n• Third casters (Eldritch Knight, Arcane Trickster): one third Fighter/Rogue levels, round down.\n\nUse the Multiclass Spellcaster table for total slots. Prepare spells separately per class as if single-classed. Pact Magic (Warlock) uses its own slots and doesn't merge.\n\nCantrips and prepared spells are tracked per class. Extra Attack doesn't stack; Thirsting Blade doesn't stack with Extra Attack.",
    bodyEs:
      "Si conjuras desde más de una clase, combina niveles:\n\n• Lanzadores completos (Bardo, Clérigo, Druida, Hechicero, Mago): todos los niveles.\n• Medios (Paladín, Explorador): mitad de niveles, redondeado arriba.\n• Tercios (Caballero arcano, Tramposo arcano): un tercio de niveles de Guerrero/Pícaro, redondeado abajo.\n\nUsa la tabla de lanzador multiclasificación para espacios totales. Prepara conjuros por clase como si fueras monoclase. Magia del pacto (Brujo) usa espacios propios.\n\nTrucos y preparación se rastrean por clase. Ataque adicional no se acumula.",
    tags: ["multiclass", "spell slots"],
    related: ["spell-slots", "multiclassing-overview"],
    manual: "phb",
  }),
];

export const ENVIRONMENT_RULES = [
  r({
    id: "falling-damage",
    kind: "rule",
    category: "exploration",
    titleEn: "Falling",
    titleEs: "Caídas",
    summaryEn: "1d6 bludgeoning damage per 10 feet fallen, max 20d6.",
    summaryEs: "1d6 de daño contundente por cada 3 m de caída, máx. 20d6.",
    bodyEn:
      "A creature takes 1d6 bludgeoning damage for every 10 feet it falls, to a maximum of 20d6. The creature lands prone unless it avoids taking damage from the fall.",
    bodyEs:
      "Una criatura recibe 1d6 de daño contundente por cada 3 metros que cae, hasta un máximo de 20d6. La criatura cae tumbada salvo que evite el daño de la caída.",
    tags: ["falling", "environment"],
    related: ["dmg-hazards"],
    manual: "phb",
  }),
  r({
    id: "suffocation",
    kind: "rule",
    category: "exploration",
    titleEn: "Suffocation",
    titleEs: "Asfixia",
    summaryEn: "Hold breath for CON mod minutes; then drop to 0 HP.",
    summaryEs: "Aguanta la respiración mod. CON en minutos; luego 0 PG.",
    bodyEn:
      "A creature can hold its breath for 1 + its Constitution modifier minutes (minimum 30 seconds). When out of breath or choking, it survives CON + 1 rounds, then drops to 0 hit points and is dying.",
    bodyEs:
      "Una criatura puede contener la respiración durante 1 + su modificador de Constitución en minutos (mínimo 30 segundos). Sin aire, aguanta rondas igual a CON + 1 y luego baja a 0 puntos de golpe y está muriendo.",
    tags: ["suffocation", "environment"],
    related: ["dmg-hazards"],
    manual: "phb",
  }),
  r({
    id: "mounted-combat",
    kind: "rule",
    category: "combat",
    titleEn: "Mounted Combat",
    titleEs: "Combate montado",
    summaryEn: "Mount control, forced dismount, and lance rules.",
    summaryEs: "Control de montura, desmonte forzado y lanza.",
    bodyEn:
      "A controlled mount uses its own initiative. While mounted:\n\n• You can use the mount's speed and actions.\n• If forced to make a Dexterity save, choose you or the mount; on failure, either you or the mount (your choice) takes damage and the other takes half.\n• If the mount is knocked prone, you must make a DC 10 Dexterity save or fall off, landing prone within 5 feet.",
    bodyEs:
      "Una montura controlada usa su propia iniciativa. Montado:\n\n• Puedes usar la velocidad y acciones de la montura.\n• Si debes hacer una salvación de Destreza, eliges tú o la montura; si falla, uno recibe el daño completo y el otro la mitad.\n• Si la montura queda tumbada, haces salvación de Destreza CD 10 o caes tumbado a 1,5 m.",
    tags: ["mounted", "combat"],
    manual: "phb",
  }),
];
