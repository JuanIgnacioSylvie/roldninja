import { r } from "./helpers";

export const CONDITION_RULES = [
  r({
    id: "conditions-overview",
    category: "conditions",
    titleEn: "Conditions",
    titleEs: "Condiciones",
    summaryEn: "States that alter capabilities. Multiple instances of the same condition don't stack.",
    summaryEs: "Estados que alteran capacidades. Varias instancias de la misma condición no se acumulan.",
    bodyEn:
      "A condition alters a creature's capabilities and may be imposed by spells, attacks, or the environment. If multiple effects impose the same condition, only one instance applies (effects don't stack unless stated).\n\nConditions are listed alphabetically in the rules. See individual entries for each condition's effects.",
    bodyEs:
      "Una condición altera las capacidades de una criatura y puede imponerse por conjuros, ataques o el entorno. Si varios efectos imponen la misma condición, solo aplica una instancia (los efectos no se acumulan salvo que se indique).\n\nLas condiciones se listan alfabéticamente en las reglas. Consulta cada entrada para sus efectos.",
    tags: ["conditions", "status"],
    manual: "phb",
  }),
  r({
    id: "condition-blinded",
    category: "conditions",
    titleEn: "Blinded",
    titleEs: "Cegado",
    summaryEn: "Can't see; auto-fail sight checks; attacks have disadvantage; attacks against you have advantage.",
    summaryEs: "No puede ver; falla automáticamente tiradas que requieran vista; ataques con desventaja; ataques contra ti con ventaja.",
    bodyEn: "• Can't see and automatically fails any ability check that requires sight.\n• Attack rolls against the creature have advantage.\n• The creature's attack rolls have disadvantage.",
    bodyEs: "• No puede ver y falla automáticamente tiradas que requieran vista.\n• Las tiradas de ataque contra la criatura tienen ventaja.\n• Las tiradas de ataque de la criatura tienen desventaja.",
    tags: ["blinded", "cegado", "sight"],
    manual: "phb",
  }),
  r({
    id: "condition-charmed",
    category: "conditions",
    titleEn: "Charmed",
    titleEs: "Hechizado",
    summaryEn: "Can't attack the charmer; charmer has advantage on social checks against you.",
    summaryEs: "No puede atacar al hechizador; el hechizador tiene ventaja en tiradas sociales contra ti.",
    bodyEn:
      "• The creature can't attack the charmer or target the charmer with harmful abilities or magical effects.\n• The charmer has advantage on any ability check to interact socially with the creature.",
    bodyEs:
      "• La criatura no puede atacar al hechizador ni apuntarlo con habilidades o efectos mágicos dañinos.\n• El hechizador tiene ventaja en tiradas para interactuar socialmente con la criatura.",
    tags: ["charmed", "hechizado"],
    manual: "phb",
  }),
  r({
    id: "condition-deafened",
    category: "conditions",
    titleEn: "Deafened",
    titleEs: "Ensordecido",
    summaryEn: "Can't hear; auto-fail hearing checks.",
    summaryEs: "No puede oír; falla automáticamente tiradas que requieran oído.",
    bodyEn: "• Can't hear and automatically fails any ability check that requires hearing.",
    bodyEs: "• No puede oír y falla automáticamente tiradas que requieran oído.",
    tags: ["deafened", "ensordecido"],
    manual: "phb",
  }),
  r({
    id: "condition-exhaustion",
    category: "conditions",
    titleEn: "Exhausted",
    titleEs: "Exhausto",
    summaryEn: "Six levels of increasing penalties, from disadvantage on checks to death at level 6.",
    summaryEs: "Seis niveles de penalizadores crecientes, desde desventaja en tiradas hasta muerte en nivel 6.",
    bodyEn:
      "Exhaustion has six levels. Effects are cumulative.\n\n1. Disadvantage on ability checks.\n2. Speed halved.\n3. Disadvantage on attack rolls and saving throws.\n4. Hit Point maximum halved.\n5. Speed reduced to 0.\n6. Death.\n\nFinishing a Long Rest removes one level of Exhaustion (if you have food and drink).",
    bodyEs:
      "El agotamiento tiene seis niveles. Los efectos son acumulativos.\n\n1. Desventaja en tiradas de característica.\n2. Velocidad reducida a la mitad.\n3. Desventaja en tiradas de ataque y salvación.\n4. Máximo de PG reducido a la mitad.\n5. Velocidad reducida a 0.\n6. Muerte.\n\nTerminar un Descanso largo elimina un nivel de agotamiento (si tienes comida y bebida).",
    tags: ["exhaustion", "exhausto", "exhausted"],
    related: ["long-rest"],
    manual: "phb",
  }),
  r({
    id: "condition-frightened",
    category: "conditions",
    titleEn: "Frightened",
    titleEs: "Asustado",
    summaryEn: "Disadvantage on checks/attacks while source is in sight; can't willingly move closer.",
    summaryEs: "Desventaja en tiradas/ataques mientras ves la fuente; no puede acercarse voluntariamente.",
    bodyEn:
      "• Disadvantage on ability checks and attack rolls while the source of fear is within line of sight.\n• Can't willingly move closer to the source of fear.",
    bodyEs:
      "• Desventaja en tiradas de característica y ataque mientras la fuente del miedo esté a la vista.\n• No puede acercarse voluntariamente a la fuente del miedo.",
    tags: ["frightened", "asustado", "fear"],
    manual: "phb",
  }),
  r({
    id: "condition-grappled",
    category: "conditions",
    titleEn: "Grappled",
    titleEs: "Agarrado",
    summaryEn: "Speed becomes 0; ends if grappler is Incapacitated or moved away.",
    summaryEs: "Velocidad 0; termina si quien agarra queda Incapacitado o se aleja.",
    bodyEn:
      "• Speed becomes 0, and the creature can't benefit from bonuses to Speed.\n• The condition ends if the grappler is Incapacitated or if an effect removes the creature from the grappler's reach.",
    bodyEs:
      "• La Velocidad es 0 y la criatura no puede beneficiarse de bonificadores a la Velocidad.\n• La condición termina si quien agarra queda Incapacitado o un efecto aleja a la criatura de su alcance.",
    tags: ["grappled", "agarrado"],
    related: ["grapple-shove"],
    manual: "phb",
  }),
  r({
    id: "condition-incapacitated",
    category: "conditions",
    titleEn: "Incapacitated",
    titleEs: "Incapacitado",
    summaryEn: "Can't take actions, Bonus Actions, or Reactions.",
    summaryEs: "No puede realizar acciones, Acciones adicionales ni Reacciones.",
    bodyEn: "• Can't take actions or Bonus Actions.\n• Can't take Reactions.",
    bodyEs: "• No puede realizar acciones ni Acciones adicionales.\n• No puede usar Reacciones.",
    tags: ["incapacitated", "incapacitado"],
    manual: "phb",
  }),
  r({
    id: "condition-invisible",
    category: "conditions",
    titleEn: "Invisible",
    titleEs: "Invisible",
    summaryEn: "Heavily obscured for hiding; attacks against you have disadvantage; your attacks have advantage.",
    summaryEs: "Fuertemente oscurecido para esconderse; ataques contra ti con desventaja; tus ataques con ventaja.",
    bodyEn:
      "• Considered heavily obscured for hiding.\n• Attack rolls against the creature have disadvantage.\n• The creature's attack rolls have advantage.",
    bodyEs:
      "• Se considera fuertemente oscurecido para esconderse.\n• Las tiradas de ataque contra la criatura tienen desventaja.\n• Las tiradas de ataque de la criatura tienen ventaja.",
    tags: ["invisible", "invisibilidad"],
    manual: "phb",
  }),
  r({
    id: "condition-paralyzed",
    category: "conditions",
    titleEn: "Paralyzed",
    titleEs: "Paralizado",
    summaryEn: "Incapacitated, can't move/speak, auto-fail STR/DEX saves, attacks within 5 ft. are crits.",
    summaryEs: "Incapacitado, no puede moverse/hablar, falla salvaciones FUE/DES, ataques a 1,5 m son críticos.",
    bodyEn:
      "• Incapacitated and can't move or speak.\n• Automatically fails Strength and Dexterity saving throws.\n• Attack rolls against the creature have advantage.\n• Any attack that hits from within 5 feet is a critical hit if the attacker can see the creature.",
    bodyEs:
      "• Incapacitado y no puede moverse ni hablar.\n• Falla automáticamente tiradas de salvación de Fuerza y Destreza.\n• Las tiradas de ataque contra la criatura tienen ventaja.\n• Cualquier ataque que impacte desde 1,5 m es crítico si el atacante puede verla.",
    tags: ["paralyzed", "paralizado"],
    manual: "phb",
  }),
  r({
    id: "condition-petrified",
    category: "conditions",
    titleEn: "Petrified",
    titleEs: "Petrificado",
    summaryEn: "Turned to stone: Incapacitated, resistant to all damage, auto-fail STR/DEX saves.",
    summaryEs: "Transformado en piedra: Incapacitado, resistente a todo el daño, falla salvaciones FUE/DES.",
    bodyEn:
      "• Transformed into solid inanimate substance along with possessions.\n• Weight increases ×10; stops aging.\n• Incapacitated, can't move or speak, unaware of surroundings.\n• Attack rolls against the creature have advantage.\n• Automatically fails Strength and Dexterity saving throws.\n• Resistant to all damage.\n• Immune to poison and disease (existing conditions suspended).",
    bodyEs:
      "• Transformado en sustancia inanimada junto con sus pertenencias.\n• El peso se multiplica ×10; deja de envejecer.\n• Incapacitado, no puede moverse ni hablar, ajeno al entorno.\n• Tiradas de ataque contra la criatura tienen ventaja.\n• Falla automáticamente salvaciones de Fuerza y Destreza.\n• Resistente a todo el daño.\n• Inmune a veneno y enfermedad (condiciones existentes suspendidas).",
    tags: ["petrified", "petrificado"],
    manual: "phb",
  }),
  r({
    id: "condition-poisoned",
    category: "conditions",
    titleEn: "Poisoned",
    titleEs: "Envenenado",
    summaryEn: "Disadvantage on attack rolls and ability checks.",
    summaryEs: "Desventaja en tiradas de ataque y de característica.",
    bodyEn: "• Disadvantage on attack rolls and ability checks.",
    bodyEs: "• Desventaja en tiradas de ataque y de característica.",
    tags: ["poisoned", "envenenado"],
    manual: "phb",
  }),
  r({
    id: "condition-prone",
    category: "conditions",
    titleEn: "Prone",
    titleEs: "Derribado",
    summaryEn: "Melee attacks against you have advantage; ranged have disadvantage. Standing costs half Speed.",
    summaryEs: "Ataques cuerpo a cuerpo contra ti con ventaja; a distancia con desventaja. Levantarse cuesta mitad de Velocidad.",
    bodyEn:
      "• Only movement options are crawling or standing up (costs half Speed).\n• Disadvantage on attack rolls.\n• Attack rolls against the creature have advantage if the attacker is within 5 feet; otherwise disadvantage.",
    bodyEs:
      "• Solo puede gatear o levantarse (cuesta mitad de Velocidad).\n• Desventaja en tiradas de ataque.\n• Tiradas de ataque contra la criatura tienen ventaja si el atacante está a 1,5 m; si no, desventaja.",
    tags: ["prone", "derribado"],
    manual: "phb",
  }),
  r({
    id: "condition-restrained",
    category: "conditions",
    titleEn: "Restrained",
    titleEs: "Apresado",
    summaryEn: "Speed 0; disadvantage on attacks and DEX saves; attacks against you have advantage.",
    summaryEs: "Velocidad 0; desventaja en ataques y salvaciones DES; ataques contra ti con ventaja.",
    bodyEn:
      "• Speed becomes 0, and the creature can't benefit from bonuses to Speed.\n• Attack rolls against the creature have advantage.\n• The creature's attack rolls have disadvantage.\n• The creature has disadvantage on Dexterity saving throws.",
    bodyEs:
      "• La Velocidad es 0 y no puede beneficiarse de bonificadores a la Velocidad.\n• Tiradas de ataque contra la criatura tienen ventaja.\n• Las tiradas de ataque de la criatura tienen desventaja.\n• Desventaja en tiradas de salvación de Destreza.",
    tags: ["restrained", "apresado"],
    manual: "phb",
  }),
  r({
    id: "condition-stunned",
    category: "conditions",
    titleEn: "Stunned",
    titleEs: "Aturdido",
    summaryEn: "Incapacitated, can't move, speaks falteringly, auto-fail STR/DEX saves, attacks against you have advantage.",
    summaryEs: "Incapacitado, no puede moverse, habla con dificultad, falla salvaciones FUE/DES, ataques contra ti con ventaja.",
    bodyEn:
      "• Incapacitated, can't move, and can speak only falteringly.\n• Automatically fails Strength and Dexterity saving throws.\n• Attack rolls against the creature have advantage.",
    bodyEs:
      "• Incapacitado, no puede moverse y solo habla con dificultad.\n• Falla automáticamente salvaciones de Fuerza y Destreza.\n• Tiradas de ataque contra la criatura tienen ventaja.",
    tags: ["stunned", "aturdido"],
    manual: "phb",
  }),
  r({
    id: "condition-unconscious",
    category: "conditions",
    titleEn: "Unconscious",
    titleEs: "Inconsciente",
    summaryEn: "Incapacitated, drops items, falls Prone, auto-fail STR/DEX saves, hits within 5 ft. are crits.",
    summaryEs: "Incapacitado, suelta objetos, queda Derribado, falla salvaciones FUE/DES, impactos a 1,5 m son críticos.",
    bodyEn:
      "• Incapacitated, can't move or speak, unaware of surroundings.\n• Drops whatever it's holding and falls Prone.\n• Automatically fails Strength and Dexterity saving throws.\n• Attack rolls against the creature have advantage.\n• Any attack that hits from within 5 feet is a critical hit if the attacker can see the creature.",
    bodyEs:
      "• Incapacitado, no puede moverse ni hablar, ajeno al entorno.\n• Suelta lo que sostiene y queda Derribado.\n• Falla automáticamente salvaciones de Fuerza y Destreza.\n• Tiradas de ataque contra la criatura tienen ventaja.\n• Cualquier ataque que impacte desde 1,5 m es crítico si el atacante puede verla.",
    tags: ["unconscious", "inconsciente"],
    related: ["death-saves"],
    manual: "phb",
  }),
];
