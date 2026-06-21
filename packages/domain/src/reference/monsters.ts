/**
 * Banco de monstruos (set curado de D&D 2024).
 * No es exhaustivo: es un punto de partida ampliable con los monstruos mas comunes.
 * Los stats buscan ser fieles, pero conviene verificar contra el Monster Manual 2024
 * para casos puntuales. Para sumar mas, agregar entradas a este arreglo.
 */
import type { AbilityScores } from "../rules/abilities.js";

export interface MonsterAction {
  name: string;
  text: string;
}

export interface Monster {
  id: string;
  name: string;
  size: string;
  type: string;
  /** Valor de Desafio, p. ej. "1/4", "5". */
  cr: string;
  ac: number;
  hp: number;
  hitDice?: string;
  speed: string;
  abilityScores: AbilityScores;
  saves?: string;
  skills?: string;
  senses?: string;
  languages?: string;
  traits?: MonsterAction[];
  actions?: MonsterAction[];
}

const a = (str: number, dex: number, con: number, int: number, wis: number, cha: number): AbilityScores => ({
  str, dex, con, int, wis, cha,
});

export const MONSTERS: Monster[] = [
  {
    id: "rata-gigante", name: "Rata gigante", size: "Pequeño", type: "Bestia", cr: "1/8", ac: 12, hp: 7, hitDice: "2d6", speed: "30 pies",
    abilityScores: a(7, 15, 11, 2, 10, 4), senses: "Visión en la oscuridad 60 pies",
    traits: [{ name: "Tácticas de manada", text: "Ventaja al atacar si un aliado está a 5 pies del objetivo." }],
    actions: [{ name: "Mordisco", text: "+4 al impacto, 1d4+2 perforante." }],
  },
  {
    id: "kobold", name: "Kobold", size: "Pequeño", type: "Dracónido", cr: "1/8", ac: 12, hp: 5, hitDice: "2d6-2", speed: "30 pies",
    abilityScores: a(7, 15, 9, 8, 7, 8), senses: "Visión en la oscuridad 60 pies", languages: "Común, Dracónico",
    traits: [{ name: "Sensibilidad a la luz solar", text: "Desventaja a ataques y Percepción con luz solar." }],
    actions: [{ name: "Daga", text: "+4 al impacto, 1d4+2 perforante." }],
  },
  {
    id: "bandido", name: "Bandido", size: "Mediano", type: "Humanoide", cr: "1/8", ac: 12, hp: 11, hitDice: "2d8+2", speed: "30 pies",
    abilityScores: a(11, 12, 12, 10, 10, 10), languages: "Común",
    actions: [{ name: "Cimitarra", text: "+3 al impacto, 1d6+1 cortante." }, { name: "Ballesta ligera", text: "+3 al impacto, alcance 80/320, 1d8+1 perforante." }],
  },
  {
    id: "cultista", name: "Cultista", size: "Mediano", type: "Humanoide", cr: "1/8", ac: 12, hp: 9, hitDice: "2d8", speed: "30 pies",
    abilityScores: a(11, 12, 10, 10, 11, 10), skills: "Engaño +2, Religión +2", languages: "Común",
    actions: [{ name: "Cimitarra", text: "+3 al impacto, 1d6+1 cortante." }],
  },
  {
    id: "guardia", name: "Guardia", size: "Mediano", type: "Humanoide", cr: "1/8", ac: 16, hp: 11, hitDice: "2d8+2", speed: "30 pies",
    abilityScores: a(13, 12, 12, 10, 11, 10), skills: "Percepción +2", languages: "Común",
    actions: [{ name: "Lanza", text: "+3 al impacto, 1d6+1 perforante (1d8+1 a dos manos)." }],
  },
  {
    id: "goblin", name: "Goblin", size: "Pequeño", type: "Humanoide", cr: "1/4", ac: 15, hp: 7, hitDice: "2d6", speed: "30 pies",
    abilityScores: a(8, 14, 10, 10, 8, 8), skills: "Sigilo +6", senses: "Visión en la oscuridad 60 pies", languages: "Común, Goblin",
    traits: [{ name: "Escape ágil", text: "Puede Correr o Esconderse como acción adicional." }],
    actions: [{ name: "Cimitarra", text: "+4 al impacto, 1d6+2 cortante." }, { name: "Arco corto", text: "+4 al impacto, alcance 80/320, 1d6+2 perforante." }],
  },
  {
    id: "esqueleto", name: "Esqueleto", size: "Mediano", type: "No muerto", cr: "1/4", ac: 13, hp: 13, hitDice: "2d8+4", speed: "30 pies",
    abilityScores: a(10, 14, 15, 6, 8, 5), senses: "Visión en la oscuridad 60 pies",
    traits: [{ name: "Vulnerabilidad", text: "Vulnerable a daño contundente. Inmune a veneno y agotamiento." }],
    actions: [{ name: "Espada corta", text: "+4 al impacto, 1d6+2 perforante." }],
  },
  {
    id: "zombi", name: "Zombi", size: "Mediano", type: "No muerto", cr: "1/4", ac: 8, hp: 22, hitDice: "3d8+9", speed: "20 pies",
    abilityScores: a(13, 6, 16, 3, 6, 5), senses: "Visión en la oscuridad 60 pies",
    traits: [{ name: "Fortaleza no-muerta", text: "Si lo reduce a 0 PG (no radiante ni crítico), salva CON CD 5+daño para quedar a 1 PG." }],
    actions: [{ name: "Golpe", text: "+3 al impacto, 1d6+1 contundente." }],
  },
  {
    id: "lobo", name: "Lobo", size: "Mediano", type: "Bestia", cr: "1/4", ac: 13, hp: 11, hitDice: "2d8+2", speed: "40 pies",
    abilityScores: a(12, 15, 12, 3, 12, 6), skills: "Percepción +3, Sigilo +4",
    traits: [{ name: "Tácticas de manada", text: "Ventaja al atacar si un aliado está a 5 pies del objetivo." }],
    actions: [{ name: "Mordisco", text: "+4 al impacto, 2d4+2 perforante; CD 11 Fuerza o derribado." }],
  },
  {
    id: "hobgoblin", name: "Hobgoblin", size: "Mediano", type: "Humanoide", cr: "1/2", ac: 18, hp: 11, hitDice: "2d8+2", speed: "30 pies",
    abilityScores: a(13, 12, 12, 10, 10, 9), senses: "Visión en la oscuridad 60 pies", languages: "Común, Goblin",
    actions: [{ name: "Espada larga", text: "+3 al impacto, 1d8+1 cortante (1d10+1 a dos manos)." }],
  },
  {
    id: "orco", name: "Orco", size: "Mediano", type: "Humanoide", cr: "1/2", ac: 13, hp: 15, hitDice: "2d8+6", speed: "30 pies",
    abilityScores: a(16, 12, 16, 7, 11, 10), skills: "Intimidación +2", senses: "Visión en la oscuridad 60 pies", languages: "Común, Orco",
    traits: [{ name: "Agresivo", text: "Como acción adicional, se mueve hacia un enemigo que pueda ver." }],
    actions: [{ name: "Hacha grande", text: "+5 al impacto, 1d12+3 cortante." }],
  },
  {
    id: "gnoll", name: "Gnoll", size: "Mediano", type: "Demonio", cr: "1/2", ac: 15, hp: 22, hitDice: "5d8", speed: "30 pies",
    abilityScores: a(14, 12, 11, 6, 10, 7), senses: "Visión en la oscuridad 60 pies", languages: "Gnoll",
    traits: [{ name: "Frenesí", text: "Si reduce a una criatura a 0 PG, puede moverse y atacar como acción adicional." }],
    actions: [{ name: "Lanza", text: "+4 al impacto, 1d6+2 perforante." }, { name: "Arco largo", text: "+3 al impacto, 1d8 perforante." }],
  },
  {
    id: "araña-gigante", name: "Araña gigante", size: "Grande", type: "Bestia", cr: "1", ac: 14, hp: 26, hitDice: "4d10+4", speed: "30 pies, trepar 30 pies",
    abilityScores: a(14, 16, 12, 2, 11, 4), skills: "Sigilo +7", senses: "Visión ciega 10 pies, visión en la oscuridad 60 pies",
    traits: [{ name: "Caminar por telarañas", text: "Ignora restricciones de movimiento por telarañas." }],
    actions: [{ name: "Mordisco", text: "+5 al impacto, 1d8+3 perforante + CD 11 CON o 2d8 veneno." }, { name: "Telaraña (recarga 5-6)", text: "Apresa a la criatura (CD 11 Destreza)." }],
  },
  {
    id: "lobo-terrible", name: "Lobo terrible", size: "Grande", type: "Bestia", cr: "1", ac: 14, hp: 37, hitDice: "5d10+10", speed: "50 pies",
    abilityScores: a(17, 15, 15, 3, 12, 7), skills: "Percepción +3, Sigilo +4",
    traits: [{ name: "Tácticas de manada", text: "Ventaja al atacar si un aliado está a 5 pies del objetivo." }],
    actions: [{ name: "Mordisco", text: "+5 al impacto, 2d6+3 perforante; CD 13 Fuerza o derribado." }],
  },
  {
    id: "oso-pardo", name: "Oso pardo", size: "Grande", type: "Bestia", cr: "1", ac: 11, hp: 34, hitDice: "4d10+12", speed: "40 pies, trepar 30 pies",
    abilityScores: a(19, 10, 16, 2, 13, 7), skills: "Percepción +3",
    actions: [{ name: "Multiataque", text: "Un mordisco y un zarpazo." }, { name: "Mordisco", text: "+6 al impacto, 1d8+4 perforante." }, { name: "Zarpazo", text: "+6 al impacto, 2d6+4 cortante." }],
  },
  {
    id: "osgo", name: "Osgo (Bugbear)", size: "Mediano", type: "Humanoide", cr: "1", ac: 16, hp: 27, hitDice: "5d8+5", speed: "30 pies",
    abilityScores: a(15, 14, 13, 8, 11, 9), skills: "Sigilo +6", senses: "Visión en la oscuridad 60 pies", languages: "Común, Goblin",
    traits: [{ name: "Ataque sorpresa", text: "+2d6 de daño si golpea a una criatura sorprendida." }],
    actions: [{ name: "Lucero del alba", text: "+4 al impacto, 2d8+2 perforante." }],
  },
  {
    id: "goblin-jefe", name: "Goblin jefe", size: "Pequeño", type: "Humanoide", cr: "1", ac: 17, hp: 21, hitDice: "6d6", speed: "30 pies",
    abilityScores: a(10, 14, 10, 10, 8, 10), skills: "Sigilo +6", senses: "Visión en la oscuridad 60 pies", languages: "Común, Goblin",
    traits: [{ name: "Escape ágil", text: "Puede Correr o Esconderse como acción adicional." }],
    actions: [{ name: "Multiataque", text: "Dos ataques con cimitarra." }, { name: "Cimitarra", text: "+4 al impacto, 1d6+2 cortante." }],
  },
  {
    id: "ghoul", name: "Necrófago (Ghoul)", size: "Mediano", type: "No muerto", cr: "1", ac: 12, hp: 22, hitDice: "5d8", speed: "30 pies",
    abilityScores: a(13, 15, 10, 7, 10, 6), senses: "Visión en la oscuridad 60 pies", languages: "Común",
    actions: [{ name: "Garras", text: "+4 al impacto, 2d4+2 cortante; CD 10 CON o paralizado 1 minuto." }, { name: "Mordisco", text: "+2 al impacto, 2d6+2 perforante." }],
  },
  {
    id: "armadura-animada", name: "Armadura animada", size: "Mediano", type: "Constructo", cr: "1", ac: 18, hp: 33, hitDice: "6d8+6", speed: "25 pies",
    abilityScores: a(14, 11, 13, 1, 3, 1), senses: "Visión ciega 60 pies",
    traits: [{ name: "Inmunidades", text: "Inmune a veneno, psíquico y muchas condiciones." }],
    actions: [{ name: "Multiataque", text: "Dos golpes." }, { name: "Golpe", text: "+4 al impacto, 1d6+2 contundente." }],
  },
  {
    id: "ogro", name: "Ogro", size: "Grande", type: "Gigante", cr: "2", ac: 11, hp: 59, hitDice: "7d10+21", speed: "40 pies",
    abilityScores: a(19, 8, 16, 5, 7, 7), senses: "Visión en la oscuridad 60 pies", languages: "Común, Gigante",
    actions: [{ name: "Garrote grande", text: "+6 al impacto, 2d8+4 contundente." }],
  },
  {
    id: "mimico", name: "Mímico", size: "Mediano", type: "Aberración", cr: "2", ac: 12, hp: 58, hitDice: "9d8+18", speed: "20 pies",
    abilityScores: a(17, 12, 15, 5, 13, 8), skills: "Sigilo +5", senses: "Visión en la oscuridad 60 pies",
    traits: [{ name: "Cambiaformas / Adhesivo", text: "Imita objetos; se adhiere a quien lo toca." }],
    actions: [{ name: "Pseudópodo", text: "+5 al impacto, 1d8+3 contundente + 1d8 ácido." }],
  },
  {
    id: "cubo-gelatinoso", name: "Cubo gelatinoso", size: "Grande", type: "Cieno", cr: "2", ac: 6, hp: 84, hitDice: "8d10+40", speed: "15 pies",
    abilityScores: a(14, 3, 20, 1, 6, 1), senses: "Visión ciega 60 pies",
    traits: [{ name: "Transparente", text: "Difícil de ver; envuelve criaturas." }],
    actions: [{ name: "Pseudópodo", text: "+4 al impacto, 3d6 ácido." }, { name: "Engullir", text: "Atrapa y disuelve criaturas dentro de su cuerpo." }],
  },
  {
    id: "buho-oso", name: "Búho-oso (Owlbear)", size: "Grande", type: "Monstruosidad", cr: "3", ac: 13, hp: 59, hitDice: "7d10+21", speed: "40 pies",
    abilityScores: a(20, 12, 17, 3, 12, 7), skills: "Percepción +3",
    actions: [{ name: "Multiataque", text: "Un picotazo y un zarpazo." }, { name: "Picotazo", text: "+7 al impacto, 1d10+5 perforante." }, { name: "Zarpazo", text: "+7 al impacto, 2d8+5 cortante." }],
  },
  {
    id: "espectro-wraith", name: "Aparición (Wraith)", size: "Mediano", type: "No muerto", cr: "5", ac: 13, hp: 67, hitDice: "9d8+27", speed: "60 pies (vuelo)",
    abilityScores: a(6, 16, 16, 12, 14, 15), senses: "Visión en la oscuridad 60 pies", languages: "los que conocía en vida",
    traits: [{ name: "Movimiento incorpóreo", text: "Atraviesa criaturas y objetos como terreno difícil." }],
    actions: [{ name: "Drenar vida", text: "+6 al impacto, 4d8+3 necrótico; reduce el máximo de PG." }],
  },
  {
    id: "vampiro-engendro", name: "Engendro vampírico", size: "Mediano", type: "No muerto", cr: "5", ac: 15, hp: 82, hitDice: "11d8+33", speed: "30 pies",
    abilityScores: a(16, 16, 16, 11, 10, 12), skills: "Percepción +3, Sigilo +6", languages: "los que conocía en vida",
    traits: [{ name: "Regeneración", text: "Recupera 10 PG por turno si no está al sol ni en agua corriente." }],
    actions: [{ name: "Multiataque", text: "Dos ataques, uno puede ser mordisco." }, { name: "Garras", text: "+6 al impacto, 2d4+3 cortante." }],
  },
  {
    id: "troll", name: "Troll", size: "Grande", type: "Gigante", cr: "5", ac: 15, hp: 84, hitDice: "8d10+40", speed: "30 pies",
    abilityScores: a(18, 13, 20, 7, 9, 7), senses: "Visión en la oscuridad 60 pies", languages: "Gigante",
    traits: [{ name: "Regeneración", text: "Recupera 10 PG por turno salvo daño de fuego o ácido." }],
    actions: [{ name: "Multiataque", text: "Un mordisco y dos zarpazos." }, { name: "Mordisco", text: "+7 al impacto, 1d6+4 perforante." }, { name: "Zarpazo", text: "+7 al impacto, 2d6+4 cortante." }],
  },
  {
    id: "gigante-colinas", name: "Gigante de las colinas", size: "Enorme", type: "Gigante", cr: "5", ac: 13, hp: 105, hitDice: "10d12+40", speed: "40 pies",
    abilityScores: a(21, 8, 19, 5, 9, 6), skills: "Percepción +2", languages: "Gigante",
    actions: [{ name: "Multiataque", text: "Dos golpes con garrote." }, { name: "Garrote grande", text: "+8 al impacto, 3d8+5 contundente." }, { name: "Roca", text: "+8 al impacto, alcance 60/240, 3d10+5 contundente." }],
  },
  {
    id: "azotamentes", name: "Azotamentes (Mind Flayer)", size: "Mediano", type: "Aberración", cr: "7", ac: 15, hp: 71, hitDice: "13d8+13", speed: "30 pies",
    abilityScores: a(11, 12, 12, 19, 17, 17), skills: "Arcanos +7, Percepción +6, Sigilo +4", senses: "Visión en la oscuridad 120 pies", languages: "Infracomún, telepatía 120 pies",
    traits: [{ name: "Resistencia mágica", text: "Ventaja en salvaciones contra conjuros." }],
    actions: [{ name: "Tentáculos", text: "+7 al impacto, 2d10+4 psíquico; puede apresar y devorar el cerebro." }, { name: "Estallido mental (recarga 5-6)", text: "Cono de 60 pies, CD 15 INT, 4d8+9 psíquico y aturdido." }],
  },
  {
    id: "dragon-rojo-joven", name: "Dragón rojo joven", size: "Grande", type: "Dragón", cr: "10", ac: 18, hp: 178, hitDice: "17d10+85", speed: "40 pies, vuelo 80 pies",
    abilityScores: a(23, 10, 21, 14, 11, 19), skills: "Percepción +8, Sigilo +4", senses: "Visión ciega 30 pies, visión en la oscuridad 120 pies", languages: "Común, Dracónico",
    actions: [{ name: "Multiataque", text: "Un mordisco y dos garras." }, { name: "Mordisco", text: "+10 al impacto, 2d10+6 perforante + 1d6 fuego." }, { name: "Aliento de fuego (recarga 5-6)", text: "Cono 30 pies, CD 17 Destreza, 16d6 fuego." }],
  },
  {
    id: "contemplador", name: "Contemplador (Beholder)", size: "Grande", type: "Aberración", cr: "13", ac: 18, hp: 180, hitDice: "19d10+76", speed: "0 pies, vuelo 20 pies",
    abilityScores: a(10, 14, 18, 17, 15, 17), skills: "Percepción +12", senses: "Visión en la oscuridad 120 pies", languages: "Infracomún, Subterráneo",
    traits: [{ name: "Cono antimagia", text: "Su ojo central anula la magia en un cono de 150 pies." }],
    actions: [{ name: "Mordisco", text: "+5 al impacto, 4d6 perforante." }, { name: "Rayos oculares", text: "Tres rayos al azar entre 10 efectos mágicos distintos." }],
  },
  {
    id: "dragon-rojo-adulto", name: "Dragón rojo adulto", size: "Enorme", type: "Dragón", cr: "17", ac: 19, hp: 256, hitDice: "19d12+133", speed: "40 pies, vuelo 80 pies",
    abilityScores: a(27, 10, 25, 16, 13, 23), skills: "Percepción +13, Sigilo +6", senses: "Visión ciega 60 pies, visión en la oscuridad 120 pies", languages: "Común, Dracónico",
    traits: [{ name: "Resistencia legendaria (3/día)", text: "Puede elegir tener éxito en una salvación fallida." }],
    actions: [{ name: "Multiataque", text: "Un mordisco y dos garras." }, { name: "Mordisco", text: "+14 al impacto, 2d10+8 perforante + 2d6 fuego." }, { name: "Aliento de fuego (recarga 5-6)", text: "Cono 60 pies, CD 21 Destreza, 18d6 fuego." }],
  },
  {
    id: "lich", name: "Liche (Lich)", size: "Mediano", type: "No muerto", cr: "21", ac: 17, hp: 135, hitDice: "18d8+54", speed: "30 pies",
    abilityScores: a(11, 16, 16, 20, 14, 16), skills: "Arcanos +18, Percepción +9", senses: "Visión en la oscuridad 120 pies", languages: "varios",
    traits: [{ name: "Resistencia legendaria (3/día)", text: "Puede elegir tener éxito en una salvación fallida." }, { name: "Renacer", text: "Si tiene filacteria, reaparece tras ser destruido." }],
    actions: [{ name: "Toque paralizante", text: "+12 al impacto, 3d6 frío; CD 18 CON o paralizado." }, { name: "Lanzar conjuros", text: "Mago de nivel 18 (bola de fuego, dedo de la muerte, etc.)." }],
  },
];

export const MONSTER_TYPES = [...new Set(MONSTERS.map((m) => m.type))].sort();

/** Ordena CR tipo "1/8", "1/2", "5" para comparaciones. */
export function crValue(cr: string): number {
  if (cr.includes("/")) {
    const [n, d] = cr.split("/").map(Number);
    return (n ?? 0) / (d ?? 1);
  }
  return Number(cr) || 0;
}
