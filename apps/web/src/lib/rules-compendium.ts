import type { Locale } from "@/i18n/es";
import type { ManualId } from "@/lib/srd-i18n";

export interface RuleCategory {
  id: string;
  nameEn: string;
  nameEs: string;
}

export type CompendiumKind =
  | "rule"
  | "feat"
  | "subclass"
  | "equipment"
  | "species"
  | "background"
  | "class"
  | "dm";

export interface CompendiumRule {
  id: string;
  kind?: CompendiumKind;
  category: string;
  titleEn: string;
  titleEs: string;
  summaryEn: string;
  summaryEs: string;
  bodyEn: string;
  bodyEs: string;
  tags: string[];
  related?: string[];
  manual?: ManualId;
  /** Feat: Origin, General, Fighting Style, Epic Boon */
  featCategoryEn?: string;
  featCategoryEs?: string;
  prerequisiteEn?: string;
  prerequisiteEs?: string;
  repeatable?: boolean;
  /** Subclass: barbarian, bard, etc. */
  classId?: string;
  /** Equipment: weapon | armor */
  equipmentType?: "weapon" | "armor";
}

export interface RulesCompendiumData {
  version: number;
  categories: RuleCategory[];
  rules: CompendiumRule[];
}

export function ruleTitle(rule: CompendiumRule, locale: Locale): string {
  return locale === "es" ? rule.titleEs : rule.titleEn;
}

export function ruleSummary(rule: CompendiumRule, locale: Locale): string {
  if (locale === "es" && rule.summaryEs?.trim()) return rule.summaryEs;
  return rule.summaryEn;
}

export function ruleBody(rule: CompendiumRule, locale: Locale): string {
  if (locale === "es" && rule.bodyEs?.trim()) return rule.bodyEs;
  return rule.bodyEn;
}

export function categoryName(cat: RuleCategory, locale: Locale): string {
  return locale === "es" ? cat.nameEs : cat.nameEn;
}

export function ruleKind(rule: CompendiumRule): CompendiumKind {
  return rule.kind ?? "rule";
}

export function searchRules(
  rules: CompendiumRule[],
  query: string,
  category: string,
  locale: Locale,
  kind?: CompendiumKind | "",
): CompendiumRule[] {
  const q = query.trim().toLowerCase();
  return rules.filter((r) => {
    if (kind && ruleKind(r) !== kind) return false;
    if (category && r.category !== category) return false;
    if (!q) return true;
    const title = ruleTitle(r, locale).toLowerCase();
    const summary = ruleSummary(r, locale).toLowerCase();
    const body = ruleBody(r, locale).toLowerCase();
    const altTitle = (locale === "es" ? r.titleEn : r.titleEs).toLowerCase();
    const tags = r.tags.join(" ").toLowerCase();
    return (
      title.includes(q) ||
      altTitle.includes(q) ||
      summary.includes(q) ||
      body.includes(q) ||
      tags.includes(q)
    );
  });
}
