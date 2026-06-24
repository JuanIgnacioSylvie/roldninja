import { r } from "./helpers";

export const CHECK_RULES = [
  r({
    id: "ability-checks",
    category: "checks",
    titleEn: "Ability Checks",
    titleEs: "Tiradas de característica",
    summaryEn: "d20 + ability modifier + proficiency (if proficient). Meet or beat the DC.",
    summaryEs: "d20 + modificador de característica + competencia (si aplica). Iguala o supera la CD.",
    bodyEn:
      "An ability check tests innate talent and training. Roll a d20, add the relevant ability modifier, and add your Proficiency Bonus if you are proficient in the skill or tool for that check.\n\nThe DM sets the Difficulty Class (DC). Typical DCs: Easy 10, Medium 15, Hard 20, Very Hard 25, Nearly Impossible 30.",
    bodyEs:
      "Una tirada de característica prueba talento innato y entrenamiento. Tira d20, suma el modificador de la característica y tu Bonificador de Competencia si eres competente en la habilidad o herramienta.\n\nEl DM fija la Clase de Dificultad (CD). CD típicas: Fácil 10, Media 15, Difícil 20, Muy difícil 25, Casi imposible 30.",
    tags: ["ability check", "dc", "skill"],
    related: ["saving-throws", "advantage-disadvantage"],
    manual: "phb",
  }),
  r({
    id: "saving-throws",
    category: "checks",
    titleEn: "Saving Throws",
    titleEs: "Tiradas de salvación",
    summaryEn: "Resist spells, traps, and effects. d20 + ability mod + proficiency if proficient in that save.",
    summaryEs: "Resisten conjuros, trampas y efectos. d20 + mod. característica + competencia si eres competente en esa salvación.",
    bodyEn:
      "A saving throw measures resistance to threats. Roll d20 + ability modifier + Proficiency Bonus if you are proficient in that saving throw (determined by your class).\n\nSuccess usually means half damage or avoiding an effect; failure means full effect.",
    bodyEs:
      "Una tirada de salvación mide resistencia a amenazas. Tira d20 + modificador de característica + Bonificador de Competencia si eres competente en esa salvación (definida por tu clase).\n\nEl éxito suele significar mitad de daño o evitar un efecto; el fallo, el efecto completo.",
    tags: ["saving throw", "save"],
    related: ["ability-checks", "spell-attacks-saves"],
    manual: "phb",
  }),
  r({
    id: "advantage-disadvantage",
    category: "checks",
    titleEn: "Advantage & Disadvantage",
    titleEs: "Ventaja y desventaja",
    summaryEn: "Roll 2d20, use higher (advantage) or lower (disadvantage). Don't stack.",
    summaryEs: "Tira 2d20, usa el mayor (ventaja) o menor (desventaja). No se acumulan.",
    bodyEn:
      "Advantage: roll a second d20 and use the higher roll.\nDisadvantage: roll a second d20 and use the lower roll.\n\nIf multiple situations grant advantage, you still roll only two d20. Same for disadvantage.\n\nIf you have both advantage and disadvantage, they cancel — roll one d20.",
    bodyEs:
      "Ventaja: tira un segundo d20 y usa el resultado mayor.\nDesventaja: tira un segundo d20 y usa el resultado menor.\n\nSi varias situaciones dan ventaja, solo tiras dos d20. Igual con desventaja.\n\nSi tienes ventaja y desventaja a la vez, se anulan — tira un solo d20.",
    tags: ["advantage", "disadvantage", "d20"],
    manual: "phb",
  }),
  r({
    id: "passive-scores",
    category: "checks",
    titleEn: "Passive Scores",
    titleEs: "Puntuaciones pasivas",
    summaryEn: "Passive score = 10 + all modifiers. Passive Perception detects hidden creatures.",
    summaryEs: "Puntuación pasiva = 10 + todos los modificadores. Percepción pasiva detecta criaturas ocultas.",
    bodyEn:
      "A passive score represents the default outcome of a check without rolling: 10 + all modifiers that would apply.\n\nPassive Perception = 10 + Wisdom modifier + proficiency (if proficient in Perception). Used to notice hidden creatures without actively searching.",
    bodyEs:
      "Una puntuación pasiva representa el resultado por defecto sin tirar: 10 + todos los modificadores aplicables.\n\nPercepción pasiva = 10 + modificador de Sabiduría + competencia (si eres competente en Percepción). Sirve para notar criaturas ocultas sin buscar activamente.",
    tags: ["passive", "perception"],
    related: ["action-hide", "exploration-stealth"],
    manual: "phb",
  }),
  r({
    id: "skills-list",
    category: "checks",
    titleEn: "Skills",
    titleEs: "Habilidades",
    summaryEn: "18 skills linked to abilities. Add proficiency if trained.",
    summaryEs: "18 habilidades ligadas a características. Suma competencia si estás entrenado.",
    bodyEn:
      "Skills apply proficiency to ability checks:\n\n• Strength: Athletics\n• Dexterity: Acrobatics, Sleight of Hand, Stealth\n• Intelligence: Arcana, History, Investigation, Nature, Religion\n• Wisdom: Animal Handling, Insight, Medicine, Perception, Survival\n• Charisma: Deception, Intimidation, Performance, Persuasion\n\nA skill check = d20 + ability modifier + proficiency (if proficient).",
    bodyEs:
      "Las habilidades aplican competencia a tiradas de característica:\n\n• Fuerza: Atletismo\n• Destreza: Acrobacias, Juego de manos, Sigilo\n• Inteligencia: Arcano, Historia, Investigación, Naturaleza, Religión\n• Sabiduría: Trato con animales, Perspicacia, Medicina, Percepción, Supervivencia\n• Carisma: Engaño, Intimidación, Interpretación, Persuasión\n\nTirada de habilidad = d20 + modificador de característica + competencia (si aplica).",
    tags: ["skills", "proficiency", "athletics", "stealth"],
    related: ["ability-checks"],
    manual: "phb",
  }),
  r({
    id: "contested-checks",
    category: "checks",
    titleEn: "Contested Checks",
    titleEs: "Tiradas enfrentadas",
    summaryEn: "Two creatures roll; higher total wins. Used for grapples, shoves, and similar.",
    summaryEs: "Dos criaturas tiran; gana el total mayor. Usado en agarrar, empujar y similares.",
    bodyEn:
      "When two or more creatures oppose each other directly, they make contested ability checks. Each rolls d20 + modifiers. The higher total wins. Ties: the status quo usually remains (e.g. grapple fails).",
    bodyEs:
      "Cuando dos o más criaturas se oponen directamente, hacen tiradas de característica enfrentadas. Cada una tira d20 + modificadores. Gana el total mayor. En empate, suele mantenerse el status quo (p. ej. falla el agarre).",
    tags: ["contested", "opposed"],
    related: ["grapple-shove"],
    manual: "phb",
  }),
  r({
    id: "d20-test",
    category: "checks",
    titleEn: "D20 Tests",
    titleEs: "Tiradas d20",
    summaryEn: "Attack rolls, ability checks, and saving throws are D20 Tests.",
    summaryEs: "Tiradas de ataque, de característica y de salvación son Tiradas d20.",
    bodyEn:
      "A D20 Test is a d20 roll with modifiers that determines success or failure when the outcome is uncertain.\n\nThree types:\n• Attack roll — hit a target (compare to AC).\n• Ability check — overcome a challenge (compare to DC).\n• Saving throw — resist an effect (compare to save DC).\n\nRoll d20 + modifiers. Meet or beat the target number to succeed. Natural 20 on attacks is a critical hit; natural 1 is an automatic miss.",
    bodyEs:
      "Una Tirada d20 es una tirada de d20 con modificadores que determina éxito o fallo cuando el resultado es incierto.\n\nTres tipos:\n• Tirada de ataque — impactar a un objetivo (comparar con CA).\n• Tirada de característica — superar un desafío (comparar con CD).\n• Tirada de salvación — resistir un efecto (comparar con CD de salvación).\n\nTira d20 + modificadores. Iguala o supera el número objetivo para tener éxito. 20 natural en ataques es crítico; 1 natural es fallo automático.",
    tags: ["d20", "attack", "check", "save"],
    related: ["attack-rolls", "ability-checks", "saving-throws"],
    manual: "phb",
  }),
  r({
    id: "proficiency-bonus",
    category: "checks",
    titleEn: "Proficiency Bonus",
    titleEs: "Bonificador de competencia",
    summaryEn: "Bonus based on level or CR: +2 to +6 for PCs (levels 1–20).",
    summaryEs: "Bonificación según nivel o VD: +2 a +6 para PJ (niveles 1–20).",
    bodyEn:
      "Your Proficiency Bonus reflects training. Add it to D20 Tests when you are proficient in the relevant skill, saving throw, weapon, tool, or spell attack.\n\nPC bonus by total character level: 1–4 +2, 5–8 +3, 9–12 +4, 13–16 +5, 17–20 +6.\n\nThe bonus doesn't stack — add it only once per roll. Expertise doubles it for specific checks. Spell save DC = 8 + ability modifier + Proficiency Bonus.",
    bodyEs:
      "Tu Bonificador de Competencia refleja entrenamiento. Súmalo a Tiradas d20 cuando eres competente en la habilidad, salvación, arma, herramienta o ataque con conjuro relevante.\n\nPor nivel total del personaje: 1–4 +2, 5–8 +3, 9–12 +4, 13–16 +5, 17–20 +6.\n\nNo se acumula — solo se suma una vez por tirada. Pericia lo duplica en tiradas concretas. CD de conjuro = 8 + modificador de característica + Bonificador de Competencia.",
    tags: ["proficiency", "bonus", "level"],
    related: ["ability-checks", "attack-rolls", "spell-attacks-saves"],
    manual: "phb",
  }),
  r({
    id: "tool-proficiencies",
    category: "checks",
    titleEn: "Tool Proficiencies",
    titleEs: "Competencia con herramientas",
    summaryEn: "Tools add proficiency to related ability checks and crafting.",
    summaryEs: "Las herramientas suman competencia a tiradas relacionadas y elaboración.",
    bodyEn:
      "A tool proficiency lets you add your Proficiency Bonus to ability checks that use that tool.\n\nExamples:\n• Thieves' Tools — pick locks, disarm traps (Dexterity).\n• Smith's Tools — forge metal items (Strength).\n• Herbalism Kit — identify or apply herbs (Intelligence or Wisdom).\n• Musical Instrument — perform (Charisma).\n\nMany tools have Utilize actions (identify substances, craft items) with set DCs. See the equipment chapter for each tool's uses.",
    bodyEs:
      "La competencia con una herramienta permite sumar tu Bonificador de Competencia a tiradas de característica que la usen.\n\nEjemplos:\n• Herramientas de ladrón — abrir cerraduras, desactivar trampas (Destreza).\n• Herramientas de herrero — forjar metal (Fuerza).\n• Kit de herboristería — identificar o aplicar hierbas (Inteligencia o Sabiduría).\n• Instrumento musical — interpretar (Carisma).\n\nMuchas herramientas tienen acciones Utilizar (identificar sustancias, elaborar objetos) con CDs fijas. Consulta el capítulo de equipo.",
    tags: ["tools", "proficiency", "crafting"],
    related: ["ability-checks", "proficiency-bonus"],
    manual: "phb",
  }),
  r({
    id: "ability-modifiers",
    category: "checks",
    titleEn: "Ability Scores & Modifiers",
    titleEs: "Características y modificadores",
    summaryEn: "Scores 1–20; modifier = (score − 10) ÷ 2, rounded down.",
    summaryEs: "Puntuaciones 1–20; modificador = (puntuación − 10) ÷ 2, redondeado abajo.",
    bodyEn:
      "Each ability score has a modifier used on rolls:\n\nScore 3–4: −4 | 5–6: −3 | 7–8: −2 | 9–10: −1 | 11–12: +0\n13–14: +1 | 15–16: +2 | 17–18: +3 | 19–20: +4 | 21–30: up to +9\n\nModifier = (score − 10) ÷ 2, rounded down. A score of 10–11 is average (+0).",
    bodyEs:
      "Cada característica tiene un modificador usado en tiradas:\n\n3–4: −4 | 5–6: −3 | 7–8: −2 | 9–10: −1 | 11–12: +0\n13–14: +1 | 15–16: +2 | 17–18: +3 | 19–20: +4 | 21–30: hasta +9\n\nModificador = (puntuación − 10) ÷ 2, redondeado abajo. 10–11 es promedio (+0).",
    tags: ["ability scores", "modifier"],
    related: ["ability-checks", "ability-score-standard-array", "ability-score-point-buy"],
    manual: "phb",
  }),
];
