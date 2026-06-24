import { r } from "./helpers";

function feat(
  id: string,
  titleEn: string,
  titleEs: string,
  categoryEn: string,
  categoryEs: string,
  bodyEn: string,
  bodyEs: string,
  opts?: { prerequisiteEn?: string; prerequisiteEs?: string; repeatable?: boolean },
) {
  return r({
    id,
    kind: "feat",
    category: "feats",
    titleEn,
    titleEs,
    summaryEn: `${categoryEn}${opts?.prerequisiteEn ? ` · ${opts.prerequisiteEn}` : ""}`,
    summaryEs: `${categoryEs}${opts?.prerequisiteEs ? ` · ${opts.prerequisiteEs}` : ""}`,
    bodyEn,
    bodyEs,
    featCategoryEn: categoryEn,
    featCategoryEs: categoryEs,
    prerequisiteEn: opts?.prerequisiteEn,
    prerequisiteEs: opts?.prerequisiteEs,
    repeatable: opts?.repeatable,
    tags: ["feat", categoryEn.toLowerCase(), titleEn.toLowerCase(), titleEs.toLowerCase()],
    manual: "phb",
  });
}

/** PHB feats whose descriptions did not survive PDF text extraction cleanly. */
export const FEAT_SUPPLEMENT_ENTRIES = [
  feat(
    "sharpshooter",
    "Sharpshooter",
    "Tirador certero",
    "General",
    "General",
    "Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.\n\nBypass Defenses. Your ranged weapon attacks with weapons you are proficient with ignore Half Cover and Three-Quarters Cover.\n\nFiring at Long Range. Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls.\n\nNegative Aim. Before you make an attack roll with a ranged weapon with which you have proficiency, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    "Aumento de característica. Aumenta tu Destreza en 1 (máx. 20).\n\nSuperar defensas. Tus ataques a distancia con armas en las que tienes competencia ignoran Cobertura media y tres cuartos.\n\nDisparo a larga distancia. Atacar a larga distancia no impone desventaja en tus tiradas de ataque a distancia.\n\nPuntería negativa. Antes de un ataque a distancia con un arma en la que tienes competencia, puedes tomar -5 a la tirada de ataque. Si impacta, sumas +10 al daño.",
    { prerequisiteEn: "Level 4+, Dexterity 13+", prerequisiteEs: "Nivel 4+, Destreza 13+" },
  ),
  feat(
    "keen-mind",
    "Keen Mind",
    "Mente aguda",
    "General",
    "General",
    "Ability Score Increase. Increase your Intelligence score by 1, to a maximum of 20.\n\nLoremaster. You gain proficiency in one of the following skills: Arcana, History, Investigation, Nature, or Religion.\n\nQuick Study. Whenever you take the Study action, you can make one Intelligence check of your choice with proficiency.",
    "Aumento de característica. Aumenta tu Inteligencia en 1 (máx. 20).\n\nMaestro del saber. Ganas competencia en una de: Arcanos, Historia, Investigación, Naturaleza o Religión.\n\nEstudio rápido. Cuando usas la acción Estudiar, puedes hacer una tirada de Inteligencia a tu elección con competencia.",
    { prerequisiteEn: "Level 4+, Intelligence 13+", prerequisiteEs: "Nivel 4+, Inteligencia 13+" },
  ),
  feat(
    "martial-weapon-training",
    "Martial Weapon Training",
    "Entrenamiento con armas marciales",
    "General",
    "General",
    "You gain proficiency with Martial weapons.",
    "Ganas competencia con armas marciales.",
  ),
  feat(
    "medium-armor-master",
    "Medium Armor Master",
    "Maestro de armadura media",
    "General",
    "General",
    "Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nAdjusted Gear. While wearing Medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity modifier of +2 or higher.",
    "Aumento de característica. Aumenta tu Fuerza o Destreza en 1 (máx. 20).\n\nArmadura ajustada. Con armadura media, puedes sumar 3 (en lugar de 2) a tu CA si tu modificador de Destreza es +2 o mayor.",
    { prerequisiteEn: "Level 4+, Medium Armor Training", prerequisiteEs: "Nivel 4+, entrenamiento en armadura media" },
  ),
];
