import type { CompendiumRule } from "@/lib/rules-compendium";
import type { ManualId } from "@/lib/srd-i18n";

type RuleInput = {
  id: string;
  kind?: CompendiumRule["kind"];
  category: string;
  titleEn: string;
  titleEs: string;
  summaryEn: string;
  summaryEs: string;
  bodyEn: string;
  bodyEs: string;
  tags?: string[];
  related?: string[];
  manual?: ManualId;
  featCategoryEn?: string;
  featCategoryEs?: string;
  prerequisiteEn?: string;
  prerequisiteEs?: string;
  repeatable?: boolean;
  classId?: string;
  equipmentType?: "weapon" | "armor";
};

export function r(input: RuleInput): CompendiumRule {
  return { ...input, tags: input.tags ?? [] };
}

export function weapon(
  id: string,
  nameEn: string,
  nameEs: string,
  statsEn: string,
  statsEs: string,
  bodyEn: string,
  bodyEs: string,
): CompendiumRule {
  return r({
    id,
    kind: "equipment",
    category: "weapons",
    equipmentType: "weapon",
    titleEn: nameEn,
    titleEs: nameEs,
    summaryEn: statsEn,
    summaryEs: statsEs,
    bodyEn,
    bodyEs,
    tags: ["weapon", nameEn.toLowerCase(), nameEs.toLowerCase()],
    manual: "phb",
  });
}

export function armorPiece(
  id: string,
  nameEn: string,
  nameEs: string,
  statsEn: string,
  statsEs: string,
  bodyEn: string,
  bodyEs: string,
): CompendiumRule {
  return r({
    id,
    kind: "equipment",
    category: "armor",
    equipmentType: "armor",
    titleEn: nameEn,
    titleEs: nameEs,
    summaryEn: statsEn,
    summaryEs: statsEs,
    bodyEn,
    bodyEs,
    tags: ["armor", nameEn.toLowerCase()],
    manual: "phb",
  });
}
