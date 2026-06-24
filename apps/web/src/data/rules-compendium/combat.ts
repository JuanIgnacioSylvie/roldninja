import { r } from "./helpers";

export const COMBAT_RULES = [
  r({
    id: "combat-overview",
    category: "combat",
    titleEn: "The Order of Combat",
    titleEs: "Orden del combate",
    summaryEn: "Combat unfolds in rounds. Each participant takes a turn on initiative order.",
    summaryEs: "El combate se desarrolla en rondas. Cada participante actúa en orden de iniciativa.",
    bodyEn:
      "A round represents about 6 seconds. Combat proceeds in these steps:\n\n1. Establish positions and roll initiative (Dexterity check; ties: higher Dex wins, then DM decides).\n2. Each creature takes a turn in initiative order (highest first).\n3. Repeat step 2 until combat ends.\n\nOn your turn you can move up to your Speed and take one Action. You may also take one Bonus Action if you have a feature that grants one, and one Reaction per round (not on your turn).",
    bodyEs:
      "Una ronda representa unos 6 segundos. El combate sigue estos pasos:\n\n1. Establecer posiciones y tirar iniciativa (tirada de Destreza; empates: gana mayor DES, luego decide el DM).\n2. Cada criatura actúa en orden de iniciativa (de mayor a menor).\n3. Repetir el paso 2 hasta que termine el combate.\n\nEn tu turno puedes moverte hasta tu Velocidad y realizar una Acción. También puedes usar una Acción adicional si tienes una característica que la conceda, y una Reacción por ronda (fuera de tu turno).",
    tags: ["combat", "round", "initiative", "turn"],
    related: ["initiative", "actions-on-turn", "reactions"],
    manual: "phb",
  }),
  r({
    id: "initiative",
    category: "combat",
    titleEn: "Initiative",
    titleEs: "Iniciativa",
    summaryEn: "Dexterity check that sets turn order. DM may roll for groups of identical creatures.",
    summaryEs: "Tirada de Destreza que define el orden de turnos. El DM puede tirar por grupos de criaturas iguales.",
    bodyEn:
      "When combat starts, every participant makes a Dexterity check. The DM ranks everyone from highest to lowest; that is the order for the whole combat.\n\nA creature that is surprised cannot move or take actions on its first turn, and it can't take a Reaction until that turn ends.",
    bodyEs:
      "Al iniciar el combate, cada participante hace una tirada de Destreza. El DM ordena a todos de mayor a menor; ese es el orden durante todo el combate.\n\nUna criatura sorprendida no puede moverse ni realizar acciones en su primer turno, y no puede usar Reacciones hasta que ese turno termine.",
    tags: ["initiative", "dexterity", "surprise"],
    related: ["combat-overview", "surprise"],
    manual: "phb",
  }),
  r({
    id: "attack-rolls",
    category: "combat",
    titleEn: "Attack Rolls",
    titleEs: "Tiradas de ataque",
    summaryEn: "d20 + ability modifier + proficiency (if proficient) vs. target's AC.",
    summaryEs: "d20 + modificador de característica + competencia (si aplica) vs. CA del objetivo.",
    bodyEn:
      "When you make an attack, roll a d20 and add the appropriate modifiers. If the total equals or exceeds the target's Armor Class (AC), the attack hits.\n\n• Melee weapons: usually Strength; Finesse weapons may use Dexterity.\n• Ranged weapons: usually Dexterity.\n• Spell attacks: use your spellcasting ability.\n\nAdd your Proficiency Bonus if you are proficient with the weapon or spell.\n\nNatural 20: critical hit — roll all damage dice twice.\nNatural 1: automatic miss (regardless of modifiers).",
    bodyEs:
      "Al atacar, tira un d20 y suma los modificadores correspondientes. Si el total iguala o supera la Clase de Armadura (CA) del objetivo, el ataque impacta.\n\n• Armas cuerpo a cuerpo: normalmente Fuerza; armas de Sutileza pueden usar Destreza.\n• Armas a distancia: normalmente Destreza.\n• Ataques con conjuro: usan tu característica de conjuro.\n\nSuma tu Bonificador de Competencia si eres competente con el arma o el conjuro.\n\n20 natural: golpe crítico — tira todos los dados de daño dos veces.\n1 natural: fallo automático (sin importar modificadores).",
    tags: ["attack", "d20", "ac", "critical", "hit"],
    related: ["damage-rolls", "cover"],
    manual: "phb",
  }),
  r({
    id: "damage-rolls",
    category: "combat",
    titleEn: "Damage & Healing",
    titleEs: "Daño y curación",
    summaryEn: "Roll damage dice + modifiers. Subtract from HP. Temp HP absorbs damage first.",
    summaryEs: "Tira dados de daño + modificadores. Resta de PG. Los PG temporales absorben daño primero.",
    bodyEn:
      "Each weapon, spell, or ability specifies the damage dice to roll. Add relevant modifiers (usually the same ability used for the attack).\n\nWhen you take damage, subtract it from your Hit Points (HP). If you have Temporary HP, they are lost first.\n\nHealing restores HP but cannot exceed your maximum. Temporary HP do not stack — you choose whether to keep existing temp HP or gain new ones.\n\nDamage Resistance: halve damage (round down). Vulnerability: double damage.",
    bodyEs:
      "Cada arma, conjuro o habilidad indica los dados de daño a tirar. Suma los modificadores relevantes (normalmente la misma característica del ataque).\n\nAl recibir daño, resta de tus Puntos de Golpe (PG). Si tienes PG temporales, se pierden primero.\n\nLa curación restaura PG pero no puede superar el máximo. Los PG temporales no se acumulan — eliges conservar los actuales o ganar otros nuevos.\n\nResistencia al daño: reduce a la mitad (redondeando hacia abajo). Vulnerabilidad: duplica el daño.",
    tags: ["damage", "healing", "resistance", "vulnerability", "temp hp"],
    related: ["attack-rolls", "death-saves"],
    manual: "phb",
  }),
  r({
    id: "cover",
    category: "combat",
    titleEn: "Cover",
    titleEs: "Cobertura",
    summaryEn: "Half (+2 AC/Dex saves), Three-Quarters (+5), Total (can't be targeted).",
    summaryEs: "Media (+2 CA/tiradas DES), Tres cuartos (+5), Total (no puede ser objetivo).",
    bodyEn:
      "Walls, trees, creatures, and other obstacles can provide cover.\n\n• Half cover: +2 bonus to AC and Dexterity saving throws.\n• Three-quarters cover: +5 bonus to AC and Dexterity saving throws.\n• Total cover: you can't be targeted directly, but area effects may still reach you.",
    bodyEs:
      "Muros, árboles, criaturas y otros obstáculos pueden dar cobertura.\n\n• Cobertura media: +2 a CA y tiradas de salvación de Destreza.\n• Cobertura de tres cuartos: +5 a CA y tiradas de salvación de Destreza.\n• Cobertura total: no puedes ser objetivo directo, pero efectos de área aún pueden alcanzarte.",
    tags: ["cover", "ac", "dexterity save"],
    related: ["attack-rolls"],
    manual: "phb",
  }),
  r({
    id: "grapple-shove",
    category: "combat",
    titleEn: "Grapple & Shove",
    titleEs: "Agarrar y empujar",
    summaryEn: "Special melee attack: Athletics vs. Athletics or Acrobatics.",
    summaryEs: "Ataque cuerpo a cuerpo especial: Atletismo vs. Atletismo o Acrobacias.",
    bodyEn:
      "When you take the Attack action, you can replace one attack with a grapple or shove (if you have a free hand for grapple).\n\nGrapple: Athletics check contested by target's Athletics or Acrobatics. On success, the target has the Grappled condition (escape: action + Athletics or Acrobatics vs. your Athletics).\n\nShove: same contest. On success, push the target 5 feet or knock it Prone.",
    bodyEs:
      "Al usar la acción Atacar, puedes sustituir un ataque por agarrar o empujar (agarrar requiere una mano libre).\n\nAgarrar: tirada de Atletismo enfrentada por Atletismo o Acrobacias del objetivo. Si ganas, el objetivo queda Agarrado (escapar: acción + Atletismo o Acrobacias vs. tu Atletismo).\n\nEmpujar: misma enfrentada. Si ganas, empujas al objetivo 1,5 m o lo dejas Derribado.",
    tags: ["grapple", "shove", "athletics", "acrobatics"],
    related: ["condition-grappled", "condition-prone"],
    manual: "phb",
  }),
  r({
    id: "opportunity-attacks",
    category: "combat",
    titleEn: "Opportunity Attacks",
    titleEs: "Ataques de oportunidad",
    summaryEn: "Reaction: one melee attack when a hostile creature you can see leaves your reach.",
    summaryEs: "Reacción: un ataque cuerpo a cuerpo cuando una criatura hostil que ves sale de tu alcance.",
    bodyEn:
      "You can make an opportunity attack when a hostile creature you can see moves out of your reach. You make one melee attack against that creature using your Reaction.\n\nMoving within someone's reach does not provoke opportunity attacks. Some features (e.g. Disengage action) prevent provoking them.",
    bodyEs:
      "Puedes hacer un ataque de oportunidad cuando una criatura hostil que ves sale de tu alcance. Realizas un ataque cuerpo a cuerpo contra esa criatura usando tu Reacción.\n\nMoverse dentro del alcance de alguien no provoca ataques de oportunidad. Algunas habilidades (p. ej. la acción Desenganchar) evitan provocarlos.",
    tags: ["opportunity", "reaction", "reach"],
    related: ["reactions", "action-disengage"],
    manual: "phb",
  }),
  r({
    id: "surprise",
    category: "combat",
    titleEn: "Surprise",
    titleEs: "Sorpresa",
    summaryEn: "Creatures unaware of combatants are surprised and skip their first turn.",
    summaryEs: "Las criaturas que no detectan a los combatientes están sorprendidas y pierden su primer turno.",
    bodyEn:
      "If a combatant is caught unawares at the start of combat, it is surprised. A surprised creature can't move or take actions on its first turn and can't take Reactions until that turn ends.\n\nIf no one is trying to be stealthy, combatants roll initiative as normal. The DM determines who is surprised based on Stealth checks vs. passive Perception.",
    bodyEs:
      "Si un combatiente es sorprendido al inicio del combate, queda en estado de sorpresa. Una criatura sorprendida no puede moverse ni actuar en su primer turno y no puede usar Reacciones hasta que ese turno termine.\n\nSi nadie intenta ser sigiloso, todos tiran iniciativa con normalidad. El DM determina quién está sorprendido comparando Sigilo con Percepción pasiva.",
    tags: ["surprise", "stealth", "perception"],
    related: ["initiative", "combat-overview"],
    manual: "phb",
  }),
  r({
    id: "death-saves",
    category: "combat",
    titleEn: "Dropping to 0 Hit Points",
    titleEs: "Caer a 0 puntos de golpe",
    summaryEn: "At 0 HP: death saves, stable at 3 successes, die at 3 failures or massive damage.",
    summaryEs: "A 0 PG: tiradas de salvación contra la muerte; 3 éxitos = estable; 3 fallos = muerte.",
    bodyEn:
      "When you drop to 0 HP but aren't killed outright, you fall Unconscious and must make death saving throws at the start of each of your turns.\n\n• Roll d20: 10+ = success, 9 or lower = failure.\n• Natural 20: regain 1 HP.\n• Natural 1: counts as two failures.\n• 3 successes: you stabilize (0 HP, unconscious).\n• 3 failures: you die.\n\nTaking damage while at 0 HP: one failure (two on a critical hit). Stabilizing or healing ends death saves.\n\nMassive damage: if damage remaining after dropping to 0 equals or exceeds your HP maximum, you die instantly.",
    bodyEs:
      "Al caer a 0 PG sin morir al instante, quedas Inconsciente y debes hacer tiradas de salvación contra la muerte al inicio de cada uno de tus turnos.\n\n• d20: 10+ = éxito, 9 o menos = fallo.\n• 20 natural: recuperas 1 PG.\n• 1 natural: cuenta como dos fallos.\n• 3 éxitos: te estabilizas (0 PG, inconsciente).\n• 3 fallos: mueres.\n\nRecibir daño a 0 PG: un fallo (dos si es crítico). Estabilizarte o curarte termina las tiradas.\n\nDaño masivo: si el daño restante tras caer a 0 iguala o supera tu máximo de PG, mueres al instante.",
    tags: ["death", "unconscious", "dying", "stable"],
    related: ["damage-rolls", "condition-unconscious", "stabilizing-character"],
    manual: "phb",
  }),
  r({
    id: "stabilizing-character",
    category: "combat",
    titleEn: "Stabilizing a Character",
    titleEs: "Estabilizar a un personaje",
    summaryEn: "Help action + Medicine DC 10 stabilizes a creature at 0 HP.",
    summaryEs: "Acción Ayudar + Medicina CD 10 estabiliza a una criatura a 0 PG.",
    bodyEn:
      "You can take the Help action to stabilize a creature with 0 Hit Points. Make a DC 10 Wisdom (Medicine) check.\n\nOn success, the creature becomes Stable: it stops making death saves but remains Unconscious at 0 HP. If it takes damage, it stops being Stable and resumes death saves. A Stable creature regains 1 HP after 1d4 hours if not healed.",
    bodyEs:
      "Puedes usar la acción Ayudar para estabilizar a una criatura con 0 PG. Haz una tirada de Sabiduría (Medicina) CD 10.\n\nCon éxito, la criatura queda Estable: deja de hacer tiradas contra la muerte pero sigue Inconsciente a 0 PG. Si recibe daño, deja de estar estable y reanuda las tiradas. Una criatura estable recupera 1 PG tras 1d4 horas si no es curada.",
    tags: ["stable", "medicine", "dying"],
    related: ["death-saves", "action-help"],
    manual: "phb",
  }),
  r({
    id: "creature-size",
    category: "combat",
    titleEn: "Creature Size & Space",
    titleEs: "Tamaño de criatura y espacio",
    summaryEn: "Tiny to Gargantuan; determines squares controlled on a map.",
    summaryEs: "Diminuto a Colosal; define los cuadros que controla en el mapa.",
    bodyEn:
      "Size | Space (ft) | Squares\nTiny: 2½ × 2½ | 4 per square\nSmall: 5 × 5 | 1 square\nMedium: 5 × 5 | 1 square\nLarge: 10 × 10 | 2 × 2 squares\nHuge: 15 × 15 | 3 × 3 squares\nGargantuan: 20 × 20 | 4 × 4 squares\n\nYou can move through an ally's space, a Tiny creature, an Incapacitated creature, or a creature two sizes larger/smaller. Another creature's space is Difficult Terrain unless Tiny or an ally.",
    bodyEs:
      "Tamaño | Espacio (m) | Cuadros\nDiminuto: 0,6 × 0,6 | 4 por cuadro\nPequeño: 1,5 × 1,5 | 1 cuadro\nMediano: 1,5 × 1,5 | 1 cuadro\nGrande: 3 × 3 | 2 × 2 cuadros\nEnorme: 4,5 × 4,5 | 3 × 3 cuadros\nColosal: 6 × 6 | 4 × 4 cuadros\n\nPuedes atravesar el espacio de un aliado, una criatura Diminuta, una Incapacitada o una de dos tamaños de diferencia. El espacio de otra criatura es terreno difícil salvo Diminuta o aliada.",
    tags: ["size", "space", "tiny", "large"],
    related: ["movement-basics"],
    manual: "phb",
  }),
  r({
    id: "damage-types",
    category: "combat",
    titleEn: "Damage Types",
    titleEs: "Tipos de daño",
    summaryEn: "Acid, Bludgeoning, Cold, Fire, Force, Lightning, Necrotic, Piercing, Poison, Psychic, Radiant, Slashing, Thunder.",
    summaryEs: "Ácido, Contundente, Frío, Fuego, Fuerza, Relámpago, Necrótico, Perforante, Veneno, Psíquico, Radiante, Cortante, Trueno.",
    bodyEn:
      "Damage has a type that may interact with Resistance, Vulnerability, or Immunity.\n\n• Acid — corrosive liquids\n• Bludgeoning — blunt force\n• Cold — freezing energy\n• Fire — heat and flames\n• Force — pure magical energy\n• Lightning — electrical energy\n• Necrotic — life-draining energy\n• Piercing — puncturing attacks\n• Poison — toxins and venom\n• Psychic — mental assault\n• Radiant — holy or luminous energy\n• Slashing — cutting attacks\n• Thunder — concussive sound\n\nMultiple types on one hit: apply Resistance/Vulnerability separately only if all types qualify.",
    bodyEs:
      "El daño tiene un tipo que puede interactuar con Resistencia, Vulnerabilidad o Inmunidad.\n\n• Ácido • Contundente • Frío • Fuego • Fuerza • Relámpago\n• Necrótico • Perforante • Veneno • Psíquico • Radiante • Cortante • Trueno\n\nSi un golpe tiene varios tipos, aplica Resistencia/Vulnerabilidad solo cuando todos los tipos califiquen.",
    tags: ["damage", "resistance", "acid", "fire", "necrotic"],
    related: ["damage-rolls"],
    manual: "phb",
  }),
  r({
    id: "underwater-combat",
    category: "combat",
    titleEn: "Underwater Combat",
    titleEs: "Combate bajo el agua",
    summaryEn: "Melee disadvantage without Swim Speed (except Piercing); ranged limits; fire Resistance.",
    summaryEs: "Cuerpo a cuerpo con desventaja sin velocidad de nado (salvo Perforante); límites a distancia; resistencia al fuego.",
    bodyEn:
      "Impeded weapons:\n• Melee attack with a weapon underwater: Disadvantage unless you have a Swim Speed or the weapon deals Piercing damage.\n• Ranged weapon: auto-miss beyond normal range; Disadvantage within normal range.\n\nFire Resistance: anything underwater has Resistance to Fire damage.",
    bodyEs:
      "Armas dificultadas:\n• Ataque cuerpo a cuerpo bajo el agua: desventaja salvo que tengas velocidad de nado o el arma inflija daño Perforante.\n• Arma a distancia: fallo automático más allá del alcance normal; desventaja dentro del alcance normal.\n\nResistencia al fuego: todo bajo el agua tiene Resistencia al daño de Fuego.",
    tags: ["underwater", "swim", "ranged"],
    related: ["attack-rolls", "advantage-disadvantage"],
    manual: "phb",
  }),
];
