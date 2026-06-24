import { r } from "./helpers";

/** PHB backgrounds missing or garbled in PDF extraction. */
export const BACKGROUND_SUPPLEMENT_ENTRIES = [
  r({
    id: "criminal",
    kind: "background",
    category: "backgrounds",
    titleEn: "Criminal",
    titleEs: "Criminal",
    summaryEn: "Alert · Stealth, Thieves' Tools",
    summaryEs: "Alerta · Sigilo, Herramientas de ladrón",
    bodyEn:
      "Ability Scores: Dexterity, Constitution, Charisma\nFeat: Alert (see chapter 5)\nSkill Proficiencies: Stealth and Sleight of Hand\nTool Proficiency: Thieves' Tools\n\nYou eked out a living in dark alleyways, cutting purses or burgling shops. Perhaps you were a member of a small criminal syndicate. Or you might have been a lone wolf, competing with other criminals in a cutthroat underworld.",
    bodyEs:
      "Características: Destreza, Constitución, Carisma\nDote: Alerta (ver capítulo 5)\nCompetencias: Sigilo y Juego de manos\nHerramientas: Herramientas de ladrón\n\nTe ganabas la vida en callejones oscuros, cortando bolsos o robando tiendas. Quizá formabas parte de un pequeño sindicato criminal, o eras un lobo solitario compitiendo con otros delincuentes en un submundo implacable.",
    tags: ["background", "criminal"],
    manual: "phb",
  }),
  r({
    id: "soldier",
    kind: "background",
    category: "backgrounds",
    titleEn: "Soldier",
    titleEs: "Soldado",
    summaryEn: "Savage Attacker · Athletics, Intimidation",
    summaryEs: "Atacante salvaje · Atletismo, Intimidación",
    bodyEn:
      "Ability Scores: Strength, Dexterity, Constitution\nFeat: Savage Attacker (see chapter 5)\nSkill Proficiencies: Athletics and Intimidation\nTool Proficiency: Choose one kind of Gaming Set (see chapter 6)\n\nWar has been your life for as long as you can recall. You trained as a youth, studied the use of weapons and armor, and learned survival techniques. You might have been part of a national army or a mercenary company.",
    bodyEs:
      "Características: Fuerza, Destreza, Constitución\nDote: Atacante salvaje (ver capítulo 5)\nCompetencias: Atletismo e Intimidación\nHerramientas: Un juego de mesa (ver capítulo 6)\n\nLa guerra ha sido tu vida desde que tienes memoria. Entrenaste de joven, estudiaste armas y armaduras y aprendiste técnicas de supervivencia. Quizá serviste en un ejército nacional o en una compañía mercenaria.",
    tags: ["background", "soldier"],
    manual: "phb",
  }),
];
