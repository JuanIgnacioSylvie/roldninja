import { r } from "./helpers";

export const MOVEMENT_RULES = [
  r({
    id: "movement-basics",
    category: "movement",
    titleEn: "Movement & Speed",
    titleEs: "Movimiento y velocidad",
    summaryEn: "Move up to Speed each turn (can split). Difficult terrain costs 1 extra foot per foot moved.",
    summaryEs: "Muévete hasta tu Velocidad por turno (puede dividirse). Terreno difícil cuesta 1 pie extra por pie movido.",
    bodyEn:
      "Your Speed (usually 30 feet) is how far you can move on your turn. You can break up movement before and after your action.\n\nDifficult terrain: every foot costs 1 extra foot (half speed effectively).\n\nStanding from Prone costs half your Speed.\n\nYou can use special movement modes (climbing, swimming, crawling) if you have the speed for them — often at reduced rate unless you have a climb/swim speed.",
    bodyEs:
      "Tu Velocidad (normalmente 9 m) es lo lejos que puedes moverte por turno. Puedes dividir el movimiento antes y después de tu acción.\n\nTerreno difícil: cada pie cuesta 1 pie extra (efectivamente mitad de velocidad).\n\nLevantarse de Derribado cuesta mitad de tu Velocidad.\n\nPuedes usar modos especiales (escalar, nadar, gatear) si tienes velocidad para ello — a menudo a ritmo reducido salvo que tengas velocidad de escalada/nado.",
    tags: ["movement", "speed", "difficult terrain"],
    related: ["action-dash", "condition-prone"],
    manual: "phb",
  }),
  r({
    id: "jumping",
    category: "movement",
    titleEn: "Jumping",
    titleEs: "Saltar",
    summaryEn: "Long jump: STR mod. feet (min 0) with 10 ft. run-up. High jump: 3 + STR mod. feet.",
    summaryEs: "Salto largo: mod. FUE en pies (mín. 0) con carrera de 3 m. Salto alto: 3 + mod. FUE en pies.",
    bodyEn:
      "Long jump: with a 10-foot run-up, cover a number of feet equal to your Strength modifier (minimum 0). Without run-up, half that distance.\n\nHigh jump: leap into the air a number of feet equal to 3 + Strength modifier (minimum 0). Reach up 1½ times that height with your arms.",
    bodyEs:
      "Salto largo: con carrera de 3 m, cubres pies igual a tu modificador de Fuerza (mínimo 0). Sin carrera, la mitad.\n\nSalto alto: saltas pies igual a 3 + modificador de Fuerza (mínimo 0). Alcanzas 1,5 veces esa altura con los brazos.",
    tags: ["jump", "strength"],
    manual: "phb",
  }),
  r({
    id: "vision-light",
    category: "movement",
    titleEn: "Vision & Light",
    titleEs: "Visión e iluminación",
    summaryEn: "Bright light normal vision. Dim = lightly obscured. Darkness = heavily obscured (blind beyond darkvision).",
    summaryEs: "Luz brillante: visión normal. Tenue = ligeramente oscurecido. Oscuridad = fuertemente oscurecido (ciego sin visión en la oscuridad).",
    bodyEn:
      "Bright light: normal vision.\nDim light: lightly obscured — disadvantage on Perception checks that rely on sight.\nDarkness: heavily obscured — effectively blind for creatures without darkvision.\n\nDarkvision: see in darkness as dim light (no color). Blindsight and Truesight have special rules.",
    bodyEs:
      "Luz brillante: visión normal.\nLuz tenue: ligeramente oscurecido — desventaja en Percepción que dependa de la vista.\nOscuridad: fuertemente oscurecido — efectivamente ciego sin visión en la oscuridad.\n\nVisión en la oscuridad: ver en oscuridad como luz tenue (sin color). Visión ciega y Visión verdadera tienen reglas especiales.",
    tags: ["vision", "light", "darkvision"],
    manual: "phb",
  }),
];

export const WEAPON_RULES = [
  r({
    id: "weapon-properties",
    category: "weapon-rules",
    titleEn: "Weapon Properties",
    titleEs: "Propiedades de armas",
    summaryEn: "Ammunition, Finesse, Heavy, Light, Loading, Range, Reach, Thrown, Two-Handed, Versatile.",
    summaryEs: "Munición, Sutileza, Pesada, Ligera, Recarga, Alcance, Alcance (arma), Arrojadiza, A dos manos, Versátil.",
    bodyEn:
      "• Ammunition: requires ammo; draw as part of attack.\n• Finesse: use STR or DEX for attack/damage.\n• Heavy: Small creatures have disadvantage.\n• Light: suitable for two-weapon fighting.\n• Loading: one shot per action regardless of Extra Attack.\n• Range: normal/max range in feet; disadvantage beyond normal.\n• Reach: +5 feet reach.\n• Thrown: can throw using melee ability.\n• Two-Handed: requires two hands.\n• Versatile: higher damage die when used two-handed.",
    bodyEs:
      "• Munición: requiere munición; sacar como parte del ataque.\n• Sutileza: usa FUE o DES para ataque/daño.\n• Pesada: criaturas Pequeñas con desventaja.\n• Ligera: apta para combate con dos armas.\n• Recarga: un disparo por acción aunque tengas Ataque adicional.\n• Alcance: alcance normal/máximo en pies; desventaja más allá del normal.\n• Alcance (arma): +1,5 m de alcance.\n• Arrojadiza: puede lanzarse con la característica cuerpo a cuerpo.\n• A dos manos: requiere dos manos.\n• Versátil: dado de daño mayor a dos manos.",
    tags: ["weapon", "properties", "finesse", "range"],
    manual: "phb",
  }),
  r({
    id: "weapon-mastery",
    category: "weapon-rules",
    titleEn: "Weapon Mastery",
    titleEs: "Maestría de armas",
    summaryEn: "2024: each weapon has a mastery property. You can use properties equal to your mastery count.",
    summaryEs: "2024: cada arma tiene una propiedad de maestría. Puedes usar propiedades igual a tu número de maestrías.",
    bodyEn:
      "Weapon Mastery (2024): weapons have a mastery property you can use when proficient.\n\n• Cleave: on hit, damage second creature within 5 ft.\n• Graze: on miss, deal ability modifier damage.\n• Nick: bonus action light weapon attack (once per turn).\n• Push: push target 10 ft. on hit.\n• Sap: target has disadvantage on next attack.\n• Slow: reduce target Speed by 10 ft. until your next turn.\n• Topple: target makes CON save or falls Prone.\n• Vex: advantage on next attack against target before end of your next turn.\n\nYou can use a number of mastery properties equal to your Weapon Mastery count (from class).",
    bodyEs:
      "Maestría de armas (2024): las armas tienen una propiedad de maestría usable si eres competente.\n\n• Hendir: al impactar, daño a segunda criatura a 1,5 m.\n• Rasguñar: al fallar, daño igual al modificador de característica.\n• Muesca: ataque adicional con arma ligera (una vez por turno).\n• Empujar: empuja al objetivo 3 m al impactar.\n• Aturdir: el objetivo tiene desventaja en su próximo ataque.\n• Ralentizar: reduce Velocidad del objetivo 3 m hasta tu próximo turno.\n• Derribar: salvación de CON o queda Derribado.\n• Vexar: ventaja en tu próximo ataque contra el objetivo antes de tu siguiente turno.\n\nPuedes usar tantas propiedades como tu número de Maestrías de armas (de la clase).",
    tags: ["mastery", "cleave", "graze", "2024"],
    manual: "phb",
  }),
  r({
    id: "armor-class",
    category: "weapon-rules",
    titleEn: "Armor & AC",
    titleEs: "Armaduras y CA",
    summaryEn: "Light: full DEX. Medium: max +2 DEX. Heavy: no DEX. Shield: +2 AC.",
    summaryEs: "Ligera: DES completa. Media: máx. +2 DES. Pesada: sin DES. Escudo: +2 CA.",
    bodyEn:
      "Without armor: AC = 10 + Dexterity modifier.\n\n• Light armor: base AC + full Dex modifier.\n• Medium armor: base AC + Dex modifier (max +2).\n• Heavy armor: base AC, no Dex modifier.\n• Shield: +2 AC (requires one hand).\n\nSome features and spells modify AC. You must be proficient to avoid penalties (e.g. can't cast spells in armor you're not proficient with).",
    bodyEs:
      "Sin armadura: CA = 10 + modificador de Destreza.\n\n• Armadura ligera: CA base + modificador DES completo.\n• Armadura media: CA base + modificador DES (máx. +2).\n• Armadura pesada: CA base, sin modificador DES.\n• Escudo: +2 CA (requiere una mano).\n\nAlgunas habilidades y conjuros modifican la CA. Debes ser competente para evitar penalizaciones (p. ej. no lanzar conjuros con armadura en la que no eres competente).",
    tags: ["armor", "ac", "shield"],
    manual: "phb",
  }),
  r({
    id: "two-weapon-fighting",
    category: "weapon-rules",
    titleEn: "Two-Weapon Fighting (Light)",
    titleEs: "Combate con dos armas (Ligera)",
    summaryEn: "Attack with a Light weapon, then Bonus Action attack with another Light weapon.",
    summaryEs: "Ataca con arma Ligera y luego Acción adicional con otra arma Ligera.",
    bodyEn:
      "When you take the Attack action and attack with a Light weapon, you can make one extra attack as a Bonus Action on the same turn with a different Light weapon.\n\nYou don't add your ability modifier to the extra attack's damage unless that modifier is negative.\n\nThe Two-Weapon Fighting fighting style adds your ability modifier to that extra damage. The Nick weapon mastery lets you make the extra Light attack as part of the Attack action instead (once per turn).",
    bodyEs:
      "Al usar la acción Atacar con un arma Ligera, puedes hacer un ataque extra como Acción adicional en el mismo turno con otra arma Ligera distinta.\n\nNo sumas tu modificador de característica al daño del ataque extra salvo que sea negativo.\n\nEl estilo de combate Combate con dos armas suma el modificador a ese daño. La maestría Muesca permite el ataque Ligera extra como parte de la acción Atacar (una vez por turno).",
    tags: ["two-weapon", "light", "bonus action"],
    related: ["weapon-properties", "weapon-mastery"],
    manual: "phb",
  }),
  r({
    id: "armor-training",
    category: "weapon-rules",
    titleEn: "Armor Training",
    titleEs: "Entrenamiento de armadura",
    summaryEn: "Light, Medium, Heavy armor and Shields require training to wear without penalty.",
    summaryEs: "Armadura ligera, media, pesada y escudos requieren entrenamiento para evitar penalizaciones.",
    bodyEn:
      "Armor Training lets you wear armor without penalty:\n\n• Light armor — full Dexterity bonus to AC.\n• Medium armor — Dexterity bonus capped at +2.\n• Heavy armor — no Dexterity bonus; may require minimum Strength.\n• Shields — +2 AC; occupies one hand.\n\nWithout training in armor you're wearing, you have Disadvantage on attack rolls and ability checks, and you can't cast spells. Druids avoid metal armor unless a feature allows it.",
    bodyEs:
      "El entrenamiento de armadura permite llevarla sin penalización:\n\n• Ligera — bonificación completa de Destreza a CA.\n• Media — Destreza máx. +2.\n• Pesada — sin Destreza; puede exigir Fuerza mínima.\n• Escudo — +2 CA; ocupa una mano.\n\nSin entrenamiento en la armadura que llevas, tienes desventaja en ataques y tiradas de característica, y no puedes lanzar conjuros. Los druidas evitan armadura de metal salvo que una habilidad lo permita.",
    tags: ["armor training", "light", "medium", "heavy"],
    related: ["armor-class"],
    manual: "phb",
  }),
  r({
    id: "improvised-weapons",
    category: "weapon-rules",
    titleEn: "Improvised Weapons",
    titleEs: "Armas improvisadas",
    summaryEn: "Objects used as weapons: 1d4 damage; DM sets type. Disadvantage if not similar to a real weapon.",
    summaryEs: "Objetos como armas: 1d4 de daño; el DM fija el tipo. Desventaja si no se parecen a un arma real.",
    bodyEn:
      "An improvised weapon deals 1d4 damage. The DM assigns a damage type (usually Bludgeoning).\n\nIf you use an object that's similar to an actual weapon, the DM may treat it as that weapon.\n\nIf you use a ranged weapon to make a melee attack, treat it as an improvised weapon (1d4).",
    bodyEs:
      "Un arma improvisada inflige 1d4 de daño. El DM asigna el tipo (normalmente Contundente).\n\nSi el objeto se parece a un arma real, el DM puede tratarlo como esa arma.\n\nSi usas un arma a distancia para un ataque cuerpo a cuerpo, cuenta como improvisada (1d4).",
    tags: ["improvised", "weapon"],
    related: ["weapon-properties"],
    manual: "phb",
  }),
];

export const REST_RULES = [
  r({
    id: "short-rest",
    category: "resting",
    titleEn: "Short Rest",
    titleEs: "Descanso corto",
    summaryEn: "At least 1 hour. Spend Hit Dice to recover HP. Some features recharge.",
    summaryEs: "Al menos 1 hora. Gasta Dados de Golpe para recuperar PG. Algunas habilidades se recargan.",
    bodyEn:
      "A Short Rest is at least 1 hour of light activity (eating, drinking, tending wounds).\n\nYou can spend one or more Hit Dice: roll each die + Constitution modifier and regain that many HP (minimum 0 per die). You regain half your spent Hit Dice (rounded down) when you finish a Long Rest.",
    bodyEs:
      "Un Descanso corto es al menos 1 hora de actividad ligera (comer, beber, curar heridas).\n\nPuedes gastar uno o más Dados de Golpe: tira cada dado + modificador de Constitución y recupera esos PG (mínimo 0 por dado). Recuperas la mitad de los Dados gastados (redondeando hacia abajo) al terminar un Descanso largo.",
    tags: ["short rest", "hit dice", "healing"],
    related: ["long-rest"],
    manual: "phb",
  }),
  r({
    id: "long-rest",
    category: "resting",
    titleEn: "Long Rest",
    titleEs: "Descanso largo",
    summaryEn: "At least 8 hours. Regain all HP, half Hit Dice, all spell slots, and many features.",
    summaryEs: "Al menos 8 horas. Recupera todos los PG, mitad de Dados de Golpe, todos los espacios y muchas habilidades.",
    bodyEn:
      "A Long Rest is at least 8 hours of sleep or light activity (max 2 hours of strenuous activity, 1 hour of fighting/spellcasting).\n\nBenefits:\n• Regain all lost HP.\n• Regain spent Hit Dice equal to half your maximum (rounded down, minimum 1).\n• Regain all spell slots.\n• Class features that recharge on a long rest reset.\n• Reduce Exhaustion by 1 (if you have food and drink).\n\nYou can benefit from one Long Rest per 24-hour period.",
    bodyEs:
      "Un Descanso largo es al menos 8 horas de sueño o actividad ligera (máx. 2 horas de actividad extenuante, 1 hora de combate/conjuros).\n\nBeneficios:\n• Recuperas todos los PG perdidos.\n• Recuperas Dados de Golpe gastados igual a la mitad del máximo (redondeando hacia abajo, mínimo 1).\n• Recuperas todos los espacios de conjuro.\n• Habilidades de clase que se recargan en descanso largo se reinician.\n• Reduce el agotamiento en 1 (si tienes comida y bebida).\n\nSolo puedes beneficiarte de un Descanso largo cada 24 horas.",
    tags: ["long rest", "spell slots", "hit dice"],
    related: ["short-rest", "condition-exhaustion"],
    manual: "phb",
  }),
];

export const EXPLORATION_RULES = [
  r({
    id: "exploration-stealth",
    category: "exploration",
    titleEn: "Stealth & Detection",
    titleEs: "Sigilo y detección",
    summaryEn: "Group Stealth uses lowest roll. Compare Stealth to passive Perception.",
    summaryEs: "Sigilo en grupo usa la tirada más baja. Compara Sigilo con Percepción pasiva.",
    bodyEn:
      "When a group tries to sneak, the DM may call for a group Dexterity (Stealth) check: everyone rolls; the group uses the lowest result.\n\nA creature is detected if its Stealth check doesn't beat a creature's passive Perception, or if an active Perception/Investigation check finds it.",
    bodyEs:
      "Cuando un grupo intenta escabullirse, el DM puede pedir una tirada grupal de Destreza (Sigilo): todos tiran; el grupo usa el resultado más bajo.\n\nUna criatura es detectada si su Sigilo no supera la Percepción pasiva de otra, o si una tirada activa de Percepción/Investigación la encuentra.",
    tags: ["stealth", "perception", "group"],
    related: ["action-hide", "passive-scores"],
    manual: "phb",
  }),
  r({
    id: "travel-pace",
    category: "exploration",
    titleEn: "Travel Pace",
    titleEs: "Ritmo de viaje",
    summaryEn: "Fast: −5 passive Perception. Slow: stealth possible, +5 passive Perception.",
    summaryEs: "Rápido: −5 Percepción pasiva. Lento: permite sigilo, +5 Percepción pasiva.",
    bodyEn:
      "Travel pace affects Perception and stealth:\n\n• Fast (4 mph / 6.4 km/h): −5 penalty to passive Perception.\n• Normal (3 mph / 4.8 km/h): no modifier.\n• Slow (2 mph / 3.2 km/h): can use Stealth while traveling; +5 to passive Perception.",
    bodyEs:
      "El ritmo de viaje afecta Percepción y sigilo:\n\n• Rápido (6,4 km/h): −5 a Percepción pasiva.\n• Normal (4,8 km/h): sin modificador.\n• Lento (3,2 km/h): puede usar Sigilo al viajar; +5 a Percepción pasiva.",
    tags: ["travel", "pace", "exploration"],
    manual: "dmg",
  }),
];

export const SOCIAL_RULES = [
  r({
    id: "influence-actions",
    category: "social",
    titleEn: "Influence Actions",
    titleEs: "Acciones de influencia",
    summaryEn: "2024: Action, Bonus Action, or Reaction to sway NPCs via ability checks.",
    summaryEs: "2024: Acción, Acción adicional o Reacción para influir en PNJ mediante tiradas.",
    bodyEn:
      "Influence actions (2024) let you sway NPC attitudes through roleplay-supported ability checks:\n\n• Action: extended argument or demonstration (Persuasion, Deception, Intimidation, Performance).\n• Bonus Action: quick quip or gesture.\n• Reaction: immediate response to something an NPC says or does.\n\nThe DM sets the DC based on the NPC's disposition and your approach. Success may shift attitude; failure may worsen it.",
    bodyEs:
      "Las acciones de influencia (2024) permiten cambiar la actitud de PNJ con tiradas apoyadas en interpretación:\n\n• Acción: argumento o demostración extendida (Persuasión, Engaño, Intimidación, Interpretación).\n• Acción adicional: comentario o gesto rápido.\n• Reacción: respuesta inmediata a algo que dice o hace un PNJ.\n\nEl DM fija la CD según la disposición del PNJ y tu enfoque. El éxito puede mejorar la actitud; el fallo, empeorarla.",
    tags: ["influence", "persuasion", "social", "2024"],
    manual: "phb",
  }),
];

export const HEROISM_RULES = [
  r({
    id: "heroic-inspiration",
    category: "heroism",
    titleEn: "Heroic Inspiration",
    titleEs: "Inspiración heroica",
    summaryEn: "Spend to roll d6 (scales with level) and add to one d20 test, or cancel enemy advantage.",
    summaryEs: "Gástala para tirar d6 (escala con nivel) y sumar a una tirada d20, o anular ventaja enemiga.",
    bodyEn:
      "Heroic Inspiration (2024) replaces the older Inspiration rule.\n\nYou can have only one at a time. The DM can award it for good roleplay, clever plans, or heroic moments. Some species/backgrounds grant it at level 1.\n\nSpend it to:\n• Roll a Heroic Inspiration die (d6 at levels 1–4, d8 at 5–10, d10 at 11–16, d12 at 17+) and add to one d20 Test (attack, ability check, or save), after rolling but before knowing the outcome; or\n• Cancel advantage on one attack roll against you.\n\nYou can give your Heroic Inspiration to another player character.",
    bodyEs:
      "La Inspiración heroica (2024) reemplaza la regla antigua de Inspiración.\n\nSolo puedes tener una a la vez. El DM puede otorgarla por buena interpretación, planes ingeniosos o momentos heroicos. Algunas especies/orígenes la conceden al nivel 1.\n\nGástala para:\n• Tirar un dado de Inspiración heroica (d6 niveles 1–4, d8 5–10, d10 11–16, d12 17+) y sumarlo a una Tirada d20 (ataque, característica o salvación), tras tirar pero antes de conocer el resultado; o\n• Anular la ventaja en una tirada de ataque contra ti.\n\nPuedes dar tu Inspiración heroica a otro personaje jugador.",
    tags: ["inspiration", "heroic", "d6", "2024"],
    manual: "phb",
  }),
];
