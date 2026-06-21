/**
 * Subconjunto de hechizos del PHB 2024 organizados por clase.
 * Ampliable con más niveles y clases.
 */
export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface SpellClassGroup {
  classId: string;
  className: string;
  spells: Spell[];
}

const cantrip = (id: string, name: string, school: string, desc: string): Spell => ({
  id,
  name,
  level: 0,
  school,
  castingTime: "1 acción",
  range: "Varía",
  components: "V, S",
  duration: "Instantáneo",
  description: desc,
});

const spell = (
  id: string,
  name: string,
  level: number,
  school: string,
  desc: string,
): Spell => ({
  id,
  name,
  level,
  school,
  castingTime: "1 acción",
  range: "Varía",
  components: "V, S, M",
  duration: "Concentración, hasta 1 minuto",
  description: desc,
});

export const SPELLS_BY_CLASS: SpellClassGroup[] = [
  {
    classId: "bard",
    className: "Bardo",
    spells: [
      cantrip("vicious-mockery", "Burla cruel", "Encantamiento", "El objetivo sufre 1d4 de daño psíquico y desventaja en su próximo ataque."),
      cantrip("prestidigitation", "Prestidigitación", "Transmutación", "Trucos menores de magia."),
      spell("healing-word", "Palabra sanadora", 1, "Evocación", "Restaura 2d4 + mod de CAR PV a una criatura a 18 m."),
      spell("charm-person", "Hechizar persona", 1, "Encantamiento", "Hechiza a un humanoide que te vea como amigable."),
      spell("thunderwave", "Onda atronadora", 1, "Evocación", "Onda de 4,5 m; 2d8 de daño de trueno y empuja."),
    ],
  },
  {
    classId: "cleric",
    className: "Clerigo",
    spells: [
      cantrip("sacred-flame", "Llama sagrada", "Evocación", "1d8 de daño radiante; ignora cobertura."),
      cantrip("guidance", "Guía", "Adivinación", "+1d4 a una prueba de habilidad."),
      spell("cure-wounds", "Curar heridas", 1, "Evocación", "Restaura 2d8 + mod de SAB PV al tocar."),
      spell("bless", "Bendición", 1, "Encantamiento", "Hasta 3 criaturas suman 1d4 a ataques y salvaciones."),
      spell("guiding-bolt", "Rayo guía", 1, "Evocación", "4d6 de daño radiante; el siguiente ataque tiene ventaja."),
    ],
  },
  {
    classId: "druid",
    className: "Druida",
    spells: [
      cantrip("produce-flame", "Crear llama", "Conjuración", "Llama en la mano; ataque a distancia 1d8 de fuego."),
      cantrip("shillelagh", "Garrote mágico", "Transmutación", "Arma usa SAB y hace 1d8 + mod de daño."),
      spell("healing-word", "Palabra sanadora", 1, "Evocación", "Restaura 2d4 + mod de SAB PV a 18 m."),
      spell("entangle", "Enredar", 1, "Conjuración", "Plantas agarran criaturas en un área de 6 m."),
      spell("thunderwave", "Onda atronadora", 1, "Evocación", "Onda de 4,5 m; 2d8 de daño de trueno."),
    ],
  },
  {
    classId: "paladin",
    className: "Paladin",
    spells: [
      spell("bless", "Bendición", 1, "Encantamiento", "Hasta 3 criaturas suman 1d4 a ataques y salvaciones."),
      spell("cure-wounds", "Curar heridas", 1, "Evocación", "Restaura 2d8 + mod de CAR PV al tocar."),
      spell("detect-evil", "Detectar el mal y el bien", 1, "Adivinación", "Detecta aberraciones, celestiales, elementales, feéricos, infernales y no muertos."),
      spell("protection-from-evil", "Protección contra el mal y el bien", 1, "Abjuración", "Protege contra tipos específicos de criaturas."),
      spell("searing-smite", "Golpe abrasador", 1, "Evocación", "Ataque de arma + 1d6 de fuego y quema al inicio del turno."),
    ],
  },
  {
    classId: "ranger",
    className: "Explorador",
    spells: [
      spell("hunters-mark", "Marca del cazador", 1, "Adivinación", "+1d6 de daño contra el objetivo marcado."),
      spell("cure-wounds", "Curar heridas", 1, "Evocación", "Restaura 2d8 + mod de SAB PV al tocar."),
      spell("speak-with-animals", "Hablar con animales", 1, "Adivinación", "Comunicación con bestias."),
      spell("fog-cloud", "Nube de niebla", 1, "Conjuración", "Esfera de 6 m de niebla densa."),
      spell("goodberry", "Bayas nutritivas", 1, "Transmutación", "10 bayas que restauran 1 PV cada una."),
    ],
  },
  {
    classId: "sorcerer",
    className: "Hechicero",
    spells: [
      cantrip("fire-bolt", "Rayo de fuego", "Evocación", "Ataque a distancia; 1d10 de daño de fuego."),
      cantrip("light", "Luz", "Evocación", "Objeto emite luz brillante en 6 m."),
      spell("magic-missile", "Proyectil mágico", 1, "Evocación", "3 dardos que impactan automáticamente por 1d4+1 cada uno."),
      spell("shield", "Escudo", 1, "Abjuración", "Reacción: +5 CA hasta tu próximo turno."),
      spell("burning-hands", "Manos ardientes", 1, "Evocación", "Cono de 4,5 m; 3d6 de daño de fuego."),
    ],
  },
  {
    classId: "warlock",
    className: "Brujo",
    spells: [
      cantrip("eldritch-blast", "Estallido místico", "Evocación", "Ataque a distancia; 1d10 de daño de fuerza."),
      cantrip("mage-hand", "Mano de mago", "Conjuración", "Mano espectral flotante."),
      spell("hex", "Maleficio", 1, "Encantamiento", "+1d6 de daño necrótico contra el objetivo."),
      spell("armor-of-agathys", "Armadura de Agathys", 1, "Abjuración", "5 PV temporales; 5 de daño de frío al contacto."),
      spell("hellish-rebuke", "Represalia infernal", 1, "Evocación", "Reacción: 2d10 de daño de fuego al atacante."),
    ],
  },
  {
    classId: "wizard",
    className: "Mago",
    spells: [
      cantrip("fire-bolt", "Rayo de fuego", "Evocación", "Ataque a distancia; 1d10 de daño de fuego."),
      cantrip("mage-hand", "Mano de mago", "Conjuración", "Mano espectral flotante."),
      spell("magic-missile", "Proyectil mágico", 1, "Evocación", "3 dardos que impactan automáticamente por 1d4+1 cada uno."),
      spell("shield", "Escudo", 1, "Abjuración", "Reacción: +5 CA hasta tu próximo turno."),
      spell("sleep", "Dormir", 1, "Encantamiento", "5d8 PV de criaturas quedan inconscientes en un área."),
    ],
  },
];

export function getSpellsForClass(classId: string): Spell[] {
  return SPELLS_BY_CLASS.find((g) => g.classId === classId)?.spells ?? [];
}

export function getSpellById(spellId: string): Spell | undefined {
  for (const group of SPELLS_BY_CLASS) {
    const found = group.spells.find((s) => s.id === spellId);
    if (found) return found;
  }
  return undefined;
}
