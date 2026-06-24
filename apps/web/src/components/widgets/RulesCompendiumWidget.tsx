"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, Scale, Search } from "lucide-react";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/es";
import { cn } from "@/lib/utils";
import {
  categoryName,
  ruleBody,
  ruleKind,
  ruleSummary,
  ruleTitle,
  searchRules,
  type CompendiumKind,
  type CompendiumRule,
} from "@/lib/rules-compendium";
import { RULES_COMPENDIUM, getRelatedRules } from "@/data/rules-compendium";
import { resolveManualOpenUrl } from "@/lib/srd-i18n";

const PDF_GENERATED_KINDS = new Set<CompendiumKind>([
  "subclass",
  "class",
  "species",
  "background",
  "feat",
]);

function compendiumRulesForLanguage(language: Locale) {
  if (language === "en") return RULES_COMPENDIUM.rules;
  return RULES_COMPENDIUM.rules.filter((rule) => {
    if (!rule.tags.includes("pdf-generated")) return true;
    return !PDF_GENERATED_KINDS.has(ruleKind(rule));
  });
}

interface RulesCompendiumWidgetProps {
  language: Locale;
  campaignId?: string;
  onSelectRule?: (ruleId: string) => void;
}

const EQUIPMENT_CATEGORIES = new Set(["weapons", "armor", "equipment"]);
const RULE_ONLY_CATEGORIES = new Set([
  "combat",
  "actions",
  "conditions",
  "magic",
  "checks",
  "movement",
  "weapon-rules",
  "resting",
  "exploration",
  "social",
  "heroism",
]);

export function RulesCompendiumWidget({
  language,
  campaignId,
  onSelectRule,
}: RulesCompendiumWidgetProps) {
  const t = useTranslation();
  const locale = language;
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<CompendiumKind | "">("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<CompendiumRule | null>(null);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    resolveManualOpenUrl("phb", locale).then((url) => {
      if (active) setManualUrl(url);
    });
    return () => {
      active = false;
    };
  }, [locale]);

  const rules = useMemo(() => compendiumRulesForLanguage(locale), [locale]);

  const categoriesForFilter = useMemo(() => {
    if (kind === "feat") return RULES_COMPENDIUM.categories.filter((c) => c.id === "feats");
    if (kind === "subclass") return RULES_COMPENDIUM.categories.filter((c) => c.id === "subclasses");
    if (kind === "equipment")
      return RULES_COMPENDIUM.categories.filter((c) => EQUIPMENT_CATEGORIES.has(c.id));
    if (kind === "species")
      return RULES_COMPENDIUM.categories.filter((c) => c.id === "species");
    if (kind === "background")
      return RULES_COMPENDIUM.categories.filter((c) => c.id === "backgrounds");
    if (kind === "class")
      return RULES_COMPENDIUM.categories.filter((c) => c.id === "classes");
    if (kind === "dm") return RULES_COMPENDIUM.categories.filter((c) => c.id === "dm");
    if (kind === "rule")
      return RULES_COMPENDIUM.categories.filter((c) => RULE_ONLY_CATEGORIES.has(c.id));
    return RULES_COMPENDIUM.categories;
  }, [kind]);

  useEffect(() => {
    if (!category) return;
    if (!categoriesForFilter.some((c) => c.id === category)) {
      setCategory("");
    }
  }, [category, categoriesForFilter]);

  const filtered = useMemo(
    () =>
      searchRules(rules, query, category, locale, kind).sort((a, b) =>
        ruleTitle(a, locale).localeCompare(ruleTitle(b, locale), locale),
      ),
    [rules, query, category, locale, kind],
  );

  const grouped = useMemo(() => {
    if (category || query.trim()) return null;
    const map = new Map<string, CompendiumRule[]>();
    for (const rule of filtered) {
      const list = map.get(rule.category) ?? [];
      list.push(rule);
      map.set(rule.category, list);
    }
    const cats = kind === "" ? RULES_COMPENDIUM.categories : categoriesForFilter;
    return cats
      .filter((c) => map.has(c.id))
      .map((c) => ({ category: c, rules: map.get(c.id)! }));
  }, [filtered, category, query, kind, categoriesForFilter]);

  useEffect(() => {
    if (!selected) return;
    if (!filtered.some((r) => r.id === selected.id)) {
      setSelected(filtered[0] ?? null);
    }
  }, [filtered, selected]);

  function ruleMeta(rule: CompendiumRule): string | null {
    const k = ruleKind(rule);
    if (k === "feat")
      return locale === "es" ? rule.featCategoryEs ?? null : rule.featCategoryEn ?? null;
    if (k === "subclass" && rule.classId) return rule.classId;
    if (k === "equipment" && rule.equipmentType)
      return rule.equipmentType === "weapon"
        ? locale === "es"
          ? "Arma"
          : "Weapon"
        : locale === "es"
          ? "Armadura"
          : "Armor";
    return null;
  }

  const kindTabs: { id: CompendiumKind | ""; label: string }[] = [
    { id: "", label: t.rules.kindAll },
    { id: "rule", label: t.rules.kindRules },
    { id: "feat", label: t.rules.kindFeats },
    { id: "subclass", label: t.rules.kindSubclasses },
    { id: "equipment", label: t.rules.kindEquipment },
    { id: "species", label: t.rules.kindSpecies },
    { id: "background", label: t.rules.kindBackgrounds },
    { id: "class", label: t.rules.kindClasses },
    { id: "dm", label: t.rules.kindDm },
  ];

  const sourceLabel =
    kind === "dm" ? t.rules.sourceDmg2024 : t.rules.sourcePhb2024;

  function openRule(rule: CompendiumRule) {
    setSelected(rule);
    onSelectRule?.(rule.id);
  }

  function renderRuleBody(rule: CompendiumRule) {
    const related = getRelatedRules(rule.id);
    return (
      <div className="space-y-2 text-xs text-parchment/80">
        {ruleBody(rule, locale)
          .split("\n")
          .filter((line) => line.trim())
          .map((line, i) => (
            <p
              key={i}
              className={cn(
                line.startsWith("•") && "pl-1",
                /^(Nivel|Level)\s+\d+:/i.test(line.trim()) &&
                  "mt-2 font-semibold text-gold first:mt-0",
              )}
            >
              {line}
            </p>
          ))}
        {related.length > 0 && (
          <div className="mt-2 border-t border-white/10 pt-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-parchment/40">
              {t.rules.related}
            </p>
            <div className="flex flex-wrap gap-1">
              {related.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => openRule(r)}
                  className="rounded bg-panel px-2 py-0.5 text-[10px] text-gold hover:bg-white/10"
                >
                  {ruleTitle(r, locale)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderRuleRow(rule: CompendiumRule) {
    const isSelected = selected?.id === rule.id;
    return (
      <button
        key={rule.id}
        type="button"
        onClick={() => openRule(rule)}
        className={cn(
          "mb-1 flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition",
          isSelected
            ? "border-gold/40 bg-gold/10"
            : "border-white/10 bg-panel2 hover:border-white/20 hover:bg-white/5",
        )}
      >
        <span className="flex-1 text-sm text-parchment">{ruleTitle(rule, locale)}</span>
        {ruleMeta(rule) && (
          <span className="rounded bg-panel px-1.5 text-[10px] capitalize text-parchment/50">
            {ruleMeta(rule)}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-white/10 p-2">
        <Scale className="h-4 w-4 shrink-0 text-gold" />
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-parchment/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.rules.search}
            className="w-full rounded bg-panel2 py-1 pl-7 pr-2 text-xs text-parchment placeholder:text-parchment/40 focus:outline-none"
          />
        </div>
        <select
          value={categoriesForFilter.some((c) => c.id === category) ? category : ""}
          onChange={(e) => setCategory(e.target.value)}
          className="max-w-[110px] rounded bg-panel2 px-1 py-1 text-xs text-parchment/80"
        >
          <option value="">{t.rules.allCategories}</option>
          {categoriesForFilter.map((c) => (
            <option key={c.id} value={c.id}>
              {categoryName(c, locale)}
            </option>
          ))}
        </select>
        {manualUrl && (
          <a
            href={manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t.rules.openPhb}
            className="rounded p-1 text-parchment/50 transition hover:bg-white/10 hover:text-gold"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        )}
        {campaignId && (
          <Link
            href={`/campaigns/${campaignId}/manuals`}
            title={t.rules.openManuals}
            className="rounded p-1 text-parchment/50 transition hover:bg-white/10 hover:text-gold"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-2 py-1">
        {kindTabs.map((tab) => (
          <button
            key={tab.id || "all"}
            type="button"
            onClick={() => {
              setKind(tab.id);
              setCategory("");
            }}
            className={cn(
              "shrink-0 rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              kind === tab.id ? "bg-arcane text-white" : "text-parchment/50 hover:bg-white/10",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "min-h-0 overflow-y-auto p-2",
            selected ? "w-full lg:w-[55%] lg:border-r lg:border-white/10" : "w-full",
          )}
        >
          <p className="mb-2 text-[10px] uppercase tracking-wide text-parchment/40">
            {filtered.length} {t.rules.entries} · {sourceLabel}
          </p>

          {grouped ? (
            <div className="space-y-3">
              {grouped.map(({ category: cat, rules }) => (
                <section key={cat.id}>
                  <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gold/70">
                    {categoryName(cat, locale)}
                  </h3>
                  {rules.map(renderRuleRow)}
                </section>
              ))}
            </div>
          ) : (
            filtered.map(renderRuleRow)
          )}

          {filtered.length === 0 && (
            <p className="py-6 text-center text-xs text-parchment/40">{t.rules.noResults}</p>
          )}
        </div>

        {selected ? (
          <div className="min-h-0 w-full shrink-0 overflow-y-auto bg-panel/50 p-3 lg:w-[45%]">
            <h3 className="font-display text-sm text-gold">{ruleTitle(selected, locale)}</h3>
            <p className="mt-1 text-[11px] italic text-parchment/50">
              {ruleSummary(selected, locale)}
            </p>
            <div className="mt-3">{renderRuleBody(selected)}</div>
          </div>
        ) : (
          <div className="hidden min-h-0 w-[45%] items-center justify-center border-l border-white/10 bg-panel/30 p-6 lg:flex">
            <p className="text-center text-xs text-parchment/40">{t.rules.selectEntry}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function RulesCompendiumEsWidget(
  props: Omit<RulesCompendiumWidgetProps, "language">,
) {
  return <RulesCompendiumWidget {...props} language="es" />;
}

export function RulesCompendiumEnWidget(
  props: Omit<RulesCompendiumWidgetProps, "language">,
) {
  return <RulesCompendiumWidget {...props} language="en" />;
}

export function RuleCardWidget({ ruleId, language }: { ruleId: string; language?: Locale }) {
  const { locale: appLocale } = useLocale();
  const locale = language ?? appLocale;
  const rule = useMemo(
    () => RULES_COMPENDIUM.rules.find((r) => r.id === ruleId) ?? null,
    [ruleId],
  );

  if (!rule) return <p className="p-2 text-xs text-parchment/50">?</p>;

  return (
    <div className="overflow-y-auto p-2">
      <h4 className="text-xs font-semibold text-gold">{ruleTitle(rule, locale)}</h4>
      <p className="mt-1 text-[10px] italic text-parchment/50">{ruleSummary(rule, locale)}</p>
      <div className="mt-2 space-y-1 text-xs text-parchment/70">
        {ruleBody(rule, locale)
          .split("\n")
          .map((line, i) => (
            <p key={i}>{line}</p>
          ))}
      </div>
    </div>
  );
}
