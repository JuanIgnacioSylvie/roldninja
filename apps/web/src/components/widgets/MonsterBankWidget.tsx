"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, ChevronDown, ChevronRight, Skull, BookOpen } from "lucide-react";
import {
  ABILITIES,
  ABILITY_LABELS,
  abilityModifier,
  crValue,
  MONSTERS,
  type Monster,
} from "@roldninja/domain";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import {
  monsterName,
  monsterSize,
  monsterType,
  monsterAbilityName,
  monsterAbilityText,
  srdSizeToTokenGrid,
  resolveManualOpenUrl,
  type SrdMonster,
} from "@/lib/srd-i18n";
import type { Locale } from "@/i18n/es";
import { loadMonsterTokenIndex, resolveMonsterTokenUrl, type MonsterTokenIndex } from "@/lib/monster-tokens";
import { assetUrl } from "@/infrastructure/config";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

type BankMonster = Monster | SrdMonster;

function isSrd(m: BankMonster): m is SrdMonster {
  return "nameEn" in m;
}

function displayName(m: BankMonster, language: Locale): string {
  if (isSrd(m)) return monsterName(m, language);
  return m.name;
}

function displayType(m: BankMonster, language: Locale): string {
  if (isSrd(m)) return monsterType(m, language);
  return m.type;
}

function displaySize(m: BankMonster, language: Locale): string {
  if (isSrd(m)) return monsterSize(m, language);
  return m.size;
}

function tokenGridSize(m: BankMonster): number {
  if (isSrd(m)) return srdSizeToTokenGrid(m.size);
  const curated: Record<string, number> = {
    Diminuto: 0.5,
    Pequeño: 1,
    Mediano: 1,
    Grande: 2,
    Enorme: 3,
    Gargantuesco: 4,
  };
  return curated[m.size] ?? 1;
}

export function getMonsterTokenGridSize(m: BankMonster): number {
  return tokenGridSize(m);
}

function monsterBankStrings(language: Locale) {
  const copy = language === "es" ? es : en;
  return {
    ...copy.monsters,
    openManual: language === "es" ? "Abrir Manual de Monstruos" : "Open Monster Manual",
    languageLabel: language === "es" ? "Español" : "English",
  };
}

export function MonsterBankWidget({
  language,
  hasBoard,
  onAddToBoard,
}: {
  language: Locale;
  hasBoard: boolean;
  onAddToBoard: (m: BankMonster, label: string, imageUrl?: string | null) => void;
}) {
  const t = monsterBankStrings(language);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [monsters, setMonsters] = useState<BankMonster[]>(language === "es" ? MONSTERS : []);
  const [source, setSource] = useState<"curado" | "SRD">(language === "es" ? "curado" : "SRD");
  const [tokenIndex, setTokenIndex] = useState<MonsterTokenIndex | null>(null);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/srd-monsters.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: SrdMonster[]) => {
        if (active && Array.isArray(data) && data.length) {
          setMonsters(data);
          setSource("SRD");
        }
      })
      .catch(() => {
        if (active && language === "es") {
          setMonsters(MONSTERS);
          setSource("curado");
        }
      });
    return () => {
      active = false;
    };
  }, [language]);

  useEffect(() => {
    let active = true;
    loadMonsterTokenIndex().then((index) => {
      if (active) setTokenIndex(index);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    resolveManualOpenUrl("mm", language).then((url) => {
      if (active) setManualUrl(url);
    });
    return () => {
      active = false;
    };
  }, [language]);

  const types = useMemo(
    () => [...new Set(monsters.map((m) => displayType(m, language)))].sort(),
    [monsters, language],
  );

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return monsters
      .filter((m) => {
        const name = displayName(m, language).toLowerCase();
        const alt = isSrd(m)
          ? language === "es"
            ? m.nameEn.toLowerCase()
            : m.nameEs.toLowerCase()
          : "";
        const matchName = name.includes(q) || alt.includes(q);
        const matchType = type === "" || displayType(m, language) === type;
        return matchName && matchType;
      })
      .sort(
        (a, b) =>
          crValue(a.cr) - crValue(b.cr) ||
          displayName(a, language).localeCompare(displayName(b, language), language),
      );
  }, [monsters, query, type, language]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-white/10 p-2">
        <Skull className="h-4 w-4 text-blood" />
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-parchment/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full rounded bg-panel2 py-1 pl-7 pr-2 text-xs text-parchment placeholder:text-parchment/40 focus:outline-none"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded bg-panel2 px-1 py-1 text-xs text-parchment/80"
        >
          <option value="">{t.allTypes}</option>
          {types.map((tp) => (
            <option key={tp} value={tp}>
              {tp}
            </option>
          ))}
        </select>
        {manualUrl && (
          <a
            href={manualUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t.openManual}
            className="rounded p-1 text-parchment/50 transition hover:bg-white/10 hover:text-gold"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="mb-2 text-[10px] uppercase tracking-wide text-parchment/40">
          {list.length} {t.count} · {source === "SRD" ? t.srdSource : t.curatedSource} · {t.languageLabel}
        </p>
        {!hasBoard && (
          <p className="mb-2 rounded bg-yellow-900/30 px-2 py-1 text-[11px] text-yellow-200">{t.noBoard}</p>
        )}
        {list.map((m) => {
          const open = expanded === m.id;
          const label = displayName(m, language);
          const tokenUrl = resolveMonsterTokenUrl(tokenIndex, m.id);
          return (
            <div key={m.id} className="mb-1 rounded-lg border border-white/10 bg-panel2">
              <button
                onClick={() => setExpanded(open ? null : m.id)}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left"
              >
                {tokenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={assetUrl(tokenUrl)}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                  />
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blood/30 text-[10px] font-bold text-white ring-1 ring-white/20">
                    {label.charAt(0)}
                  </span>
                )}
                {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <span className="flex-1 text-sm text-parchment">{label}</span>
                <span className="rounded bg-blood/40 px-1.5 text-[10px] text-white">
                  {language === "es" ? "VD" : "CR"} {m.cr}
                </span>
                <span className="text-[10px] text-parchment/40">{displayType(m, language)}</span>
              </button>

              {open && (
                <div className="border-t border-white/10 px-2 py-2 text-xs">
                  <p className="mb-1 text-parchment/50">
                    {displaySize(m, language)} · {language === "es" ? "CA" : "AC"} {m.ac} ·{" "}
                    {language === "es" ? "PG" : "HP"} {m.hp} · {m.speed}
                  </p>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {ABILITIES.map((ab) => (
                      <span key={ab} className="rounded bg-panel px-1.5 py-0.5 text-[10px]">
                        {ABILITY_LABELS[ab].slice(0, 3)} {m.abilityScores[ab]} (
                        {fmt(abilityModifier(m.abilityScores[ab]))})
                      </span>
                    ))}
                  </div>
                  {m.senses && (
                    <p className="text-parchment/60">
                      <b>{t.senses}:</b> {m.senses}
                    </p>
                  )}
                  {m.languages && (
                    <p className="text-parchment/60">
                      <b>{t.languages}:</b> {m.languages}
                    </p>
                  )}
                  {m.traits?.map((tr) => (
                    <p key={tr.name} className="mt-1 text-parchment/70">
                      <b className="text-gold">{monsterAbilityName(tr, language)}.</b>{" "}
                      {monsterAbilityText(tr, language)}
                    </p>
                  ))}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-1">
                      <p className="font-semibold uppercase text-parchment/40">{t.actions}</p>
                      {m.actions.map((act) => (
                        <p key={act.name} className="text-parchment/70">
                          <b className="text-gold">{monsterAbilityName(act, language)}.</b>{" "}
                          {monsterAbilityText(act, language)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      disabled={!hasBoard}
                      onClick={() => onAddToBoard(m, label, tokenUrl)}
                      className={cn(
                        "flex items-center gap-1 rounded px-2 py-1 text-xs",
                        hasBoard ? "bg-arcane text-white hover:bg-arcane/80" : "bg-panel text-parchment/30",
                      )}
                    >
                      <MapPin className="h-3 w-3" /> {t.addToBoard}
                    </button>
                    {!tokenUrl && <span className="text-[10px] text-parchment/40">{t.noToken}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && <p className="text-center text-xs text-parchment/40">{t.noResults}</p>}
      </div>
    </div>
  );
}

export function MonsterBankEsWidget(props: Omit<React.ComponentProps<typeof MonsterBankWidget>, "language">) {
  return <MonsterBankWidget {...props} language="es" />;
}

export function MonsterBankEnWidget(props: Omit<React.ComponentProps<typeof MonsterBankWidget>, "language">) {
  return <MonsterBankWidget {...props} language="en" />;
}
