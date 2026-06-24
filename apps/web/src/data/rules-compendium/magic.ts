import { r } from "./helpers";

export const MAGIC_RULES = [
  r({
    id: "spellcasting-basics",
    category: "magic",
    titleEn: "Spellcasting",
    titleEs: "Lanzamiento de conjuros",
    summaryEn: "Spells have level, school, casting time, range, components, duration. Use spell slots.",
    summaryEs: "Los conjuros tienen nivel, escuela, tiempo, alcance, componentes y duración. Usan espacios.",
    bodyEn:
      "A spell is a discrete magical effect. Each spell has:\n\n• Level (0 = cantrip)\n• School of magic\n• Casting time (action, bonus action, reaction, minutes, etc.)\n• Range (self, touch, feet, etc.)\n• Components: Verbal (V), Somatic (S), Material (M)\n• Duration (instantaneous, concentration, timed)\n\nCasting a spell of level 1+ consumes a spell slot of that level or higher. Cantrips can be cast at will.",
    bodyEs:
      "Un conjuro es un efecto mágico discreto. Cada conjuro tiene:\n\n• Nivel (0 = truco)\n• Escuela de magia\n• Tiempo de lanzamiento (acción, acción adicional, reacción, minutos, etc.)\n• Alcance (personal, toque, metros, etc.)\n• Componentes: Verbal (V), Somático (S), Material (M)\n• Duración (instantáneo, concentración, temporizada)\n\nLanzar un conjuro de nivel 1+ consume un espacio de ese nivel o superior. Los trucos se lanzan a voluntad.",
    tags: ["spell", "casting", "components"],
    related: ["concentration", "spell-slots"],
    manual: "phb",
  }),
  r({
    id: "concentration",
    category: "magic",
    titleEn: "Concentration",
    titleEs: "Concentración",
    summaryEn: "Some spells require concentration. Broken by damage (CON save DC 10 or half damage) or incapacitation.",
    summaryEs: "Algunos conjuros requieren concentración. Se rompe por daño (salvación CON CD 10 o mitad del daño) o incapacitación.",
    bodyEn:
      "Some spells require you to maintain concentration. You can concentrate on only one spell at a time.\n\nConcentration ends if:\n• You cast another spell that requires concentration.\n• You take damage: Constitution save DC 10 or half the damage taken (rounded down), whichever is higher. Failure ends concentration.\n• You are Incapacitated or killed.\n• The DM determines you are distracted by environmental phenomena.",
    bodyEs:
      "Algunos conjuros requieren mantener concentración. Solo puedes concentrarte en un conjuro a la vez.\n\nLa concentración termina si:\n• Lanzas otro conjuro que requiera concentración.\n• Recibes daño: salvación de Constitución CD 10 o la mitad del daño recibido (redondeando hacia abajo), lo que sea mayor. Fallar termina la concentración.\n• Quedas Incapacitado o mueres.\n• El DM determina que fenómenos ambientales te distraen.",
    tags: ["concentration", "constitution", "spell"],
    related: ["spellcasting-basics"],
    manual: "phb",
  }),
  r({
    id: "spell-slots",
    category: "magic",
    titleEn: "Spell Slots & Preparation",
    titleEs: "Espacios de conjuro y preparación",
    summaryEn: "Slots are regained on long rest. Prepared casters choose spells after each long rest.",
    summaryEs: "Los espacios se recuperan en descanso largo. Los lanzadores preparados eligen conjuros tras cada descanso largo.",
    bodyEn:
      "Spell slots are the resource for casting leveled spells. You regain all spent slots when you finish a Long Rest.\n\nPrepared casters (Cleric, Druid, Paladin, Ranger, Wizard): after a Long Rest, prepare a number of spells equal to ability modifier + class level (minimum 1). You can change your prepared list after each Long Rest.\n\nKnown casters (Bard, Sorcerer, Warlock): know a fixed list that grows with level.",
    bodyEs:
      "Los espacios de conjuro son el recurso para lanzar conjuros con nivel. Recuperas todos los gastados al terminar un Descanso largo.\n\nLanzadores preparados (Clérigo, Druida, Paladín, Explorador, Mago): tras un Descanso largo, preparas conjuros igual a modificador de característica + nivel de clase (mínimo 1). Puedes cambiar la lista tras cada Descanso largo.\n\nLanzadores de conjuros conocidos (Bardo, Hechicero, Brujo): conocen una lista fija que crece con el nivel.",
    tags: ["spell slots", "prepared", "long rest"],
    related: ["long-rest", "upcasting"],
    manual: "phb",
  }),
  r({
    id: "upcasting",
    category: "magic",
    titleEn: "Casting at Higher Levels",
    titleEs: "Lanzar a niveles superiores",
    summaryEn: "Use a higher-level slot to strengthen a spell if 'At Higher Levels' is listed.",
    summaryEs: "Usa un espacio de nivel superior para potenciar un conjuro si indica 'A niveles superiores'.",
    bodyEn:
      "When you cast a spell using a slot higher than the spell's level, the spell assumes the higher level. If the spell has an 'At Higher Levels' entry, apply those effects. Otherwise, casting with a higher slot may have no additional benefit unless the spell says so.",
    bodyEs:
      "Al lanzar un conjuro con un espacio de nivel superior al del conjuro, el conjuro se considera de ese nivel mayor. Si el conjuro tiene entrada 'A niveles superiores', aplica esos efectos. Si no, usar un espacio mayor puede no dar beneficio extra salvo que el conjuro lo indique.",
    tags: ["upcast", "higher level", "spell"],
    manual: "phb",
  }),
  r({
    id: "ritual-casting",
    category: "magic",
    titleEn: "Ritual Casting",
    titleEs: "Conjuros de ritual",
    summaryEn: "Cast a ritual spell in 10 extra minutes without using a slot (if you have the feature).",
    summaryEs: "Lanza un conjuro de ritual en 10 minutos extra sin gastar espacio (si tienes la característica).",
    bodyEn:
      "Certain spells have the Ritual tag. If you have a feature that allows ritual casting and the spell is on your class list, you can cast it as a ritual.\n\nCasting time increases by 10 minutes. The spell doesn't consume a spell slot and can't be cast at a higher level.",
    bodyEs:
      "Ciertos conjuros tienen la etiqueta Ritual. Si tienes una característica que permite lanzar rituales y el conjuro está en tu lista de clase, puedes lanzarlo como ritual.\n\nEl tiempo de lanzamiento aumenta 10 minutos. No consume espacio de conjuro y no puede lanzarse a nivel superior.",
    tags: ["ritual", "spell"],
    manual: "phb",
  }),
  r({
    id: "spell-attacks-saves",
    category: "magic",
    titleEn: "Spell Attacks & Saving Throws",
    titleEs: "Ataques con conjuro y salvaciones",
    summaryEn: "Spell attack = d20 + spellcasting ability + proficiency. Save DC = 8 + ability mod + proficiency.",
    summaryEs: "Ataque con conjuro = d20 + característica de conjuro + competencia. CD salvación = 8 + mod. característica + competencia.",
    bodyEn:
      "Spell attack modifier = your spellcasting ability modifier + proficiency bonus.\n\nSpell save DC = 8 + spellcasting ability modifier + proficiency bonus.\n\nWhen a spell requires a saving throw, the target rolls against your spell save DC. On a success, many spells deal half damage or negate an effect.",
    bodyEs:
      "Modificador de ataque con conjuro = modificador de característica de conjuro + bonificador de competencia.\n\nCD de salvación de conjuro = 8 + modificador de característica de conjuro + bonificador de competencia.\n\nCuando un conjuro requiere salvación, el objetivo tira contra tu CD. Con éxito, muchos conjuros hacen mitad de daño o anulan un efecto.",
    tags: ["spell attack", "save dc", "saving throw"],
    related: ["attack-rolls", "saving-throws"],
    manual: "phb",
  }),
  r({
    id: "spell-components",
    category: "magic",
    titleEn: "Spell Components",
    titleEs: "Componentes de conjuro",
    summaryEn: "Verbal (V), Somatic (S), Material (M). Need a free hand for S unless a focus replaces M.",
    summaryEs: "Verbal (V), Somático (S), Material (M). Mano libre para S salvo que un foco reemplace M.",
    bodyEn:
      "Verbal (V): spoken incantation in a clear voice (blocked by silence).\n\nSomatic (S): precise gestures — requires a free hand unless you hold a focus that also satisfies Material.\n\nMaterial (M): specific items. A Component Pouch or spellcasting focus can substitute unless a cost is listed (cost isn't consumed unless stated). Holy symbols, druidic focuses, and arcane focuses count for their class lists.\n\nIf you can't provide a component, you can't cast the spell.",
    bodyEs:
      "Verbal (V): incantación en voz clara (anulado por silencio).\n\nSomático (S): gestos precisos — requiere mano libre salvo que sostengas un foco que también cubra Material.\n\nMaterial (M): objetos específicos. Bolsa de componentes o foco de conjuro pueden sustituir salvo que indique coste (el coste no se consume salvo que lo diga). Símbolos sagrados, focos druídicos y arcanos cuentan para sus listas de clase.\n\nSi no puedes aportar un componente, no puedes lanzar el conjuro.",
    tags: ["components", "verbal", "somatic", "material", "focus"],
    related: ["spellcasting-basics"],
    manual: "phb",
  }),
  r({
    id: "areas-of-effect",
    category: "magic",
    titleEn: "Areas of Effect",
    titleEs: "Áreas de efecto",
    summaryEn: "Cone, Cube, Cylinder, Emanation, Line, Sphere — measure from origin.",
    summaryEs: "Cono, Cubo, Cilindro, Emanación, Línea, Esfera — mide desde el origen.",
    bodyEn:
      "Cone: lines from a point of origin; width at any distance equals that distance.\n\nCube: you choose a corner as origin; effect fills the cube.\n\nCylinder: circle on the ground with a height; origin is the center of the circle.\n\nEmanation: extends from a creature or object in all directions; moves with the origin unless instantaneous.\n\nLine: length and width from a point; choose direction.\n\nSphere: radius from a point of origin; effect spreads around corners unless blocked by Total Cover.",
    bodyEs:
      "Cono: líneas desde un punto de origen; el ancho a cada distancia iguala esa distancia.\n\nCubo: eliges una esquina como origen; el efecto llena el cubo.\n\nCilindro: círculo en el suelo con altura; el origen es el centro del círculo.\n\nEmanación: se extiende desde criatura u objeto en todas direcciones; se mueve con el origen salvo que sea instantáneo.\n\nLínea: longitud y anchura desde un punto; eliges dirección.\n\nEsfera: radio desde un punto; el efecto rodea esquinas salvo Cobertura total.",
    tags: ["cone", "sphere", "line", "emanation", "aoe"],
    related: ["spellcasting-basics"],
    manual: "phb",
  }),
];
