"use client";
import { useEffect, useMemo, useState } from "react";
import { CLASSES } from "@roldninja/domain";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import {
  spellCastingTime,
  spellDescription,
  spellDuration,
  spellName,
  spellSchool,
  type SrdSpell,
} from "@/lib/srd-i18n";

interface SpellsWidgetProps {
  classId?: string;
}

export function SpellsWidget({ classId }: SpellsWidgetProps) {
  const t = useTranslation();
  const { locale } = useLocale();
  const [spells, setSpells] = useState<SrdSpell[]>([]);
  const [selectedClass, setSelectedClass] = useState(classId ?? "wizard");
  const [selectedSpell, setSelectedSpell] = useState<SrdSpell | null>(null);

  useEffect(() => {
    fetch("/srd-spells.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SrdSpell[]) => setSpells(Array.isArray(data) ? data : []))
      .catch(() => setSpells([]));
  }, []);

  useEffect(() => {
    if (classId) setSelectedClass(classId);
  }, [classId]);

  const classOptions = CLASSES.filter((c) => c.isCaster);

  const filtered = useMemo(
    () =>
      spells
        .filter((s) => s.classes.includes(selectedClass))
        .sort((a, b) => a.level - b.level || spellName(a, locale).localeCompare(spellName(b, locale))),
    [spells, selectedClass, locale],
  );

  const byLevel = useMemo(() => {
    const groups = new Map<number, SrdSpell[]>();
    for (const s of filtered) {
      const list = groups.get(s.level) ?? [];
      list.push(s);
      groups.set(s.level, list);
    }
    return [...groups.entries()].sort(([a], [b]) => a - b);
  }, [filtered]);

  return (
    <div className="flex h-full flex-col p-2">
      <select
        value={selectedClass}
        onChange={(e) => { setSelectedClass(e.target.value); setSelectedSpell(null); }}
        className="mb-2 rounded bg-panel2 px-2 py-1 text-xs"
      >
        {classOptions.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-xs text-parchment/50">{t.spells.noSpells}</p>
        ) : (
          <div className="space-y-3">
            {byLevel.map(([level, list]) => (
              <div key={level}>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gold/70">
                  {level === 0 ? t.spells.cantrip : `${t.spells.level} ${level}`}
                </p>
                <div className="space-y-0.5">
                  {list.map((spell) => (
                    <button
                      key={spell.id}
                      onClick={() => setSelectedSpell(spell)}
                      className={cn(
                        "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition",
                        selectedSpell?.id === spell.id ? "bg-arcane text-white" : "hover:bg-white/10",
                      )}
                    >
                      <span>{spellName(spell, locale)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSpell && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <h4 className="text-xs font-semibold text-gold">{spellName(selectedSpell, locale)}</h4>
          <p className="mt-1 text-[10px] text-parchment/50">
            {spellSchool(selectedSpell, locale)} · {spellCastingTime(selectedSpell, locale)} · {selectedSpell.range}
          </p>
          <p className="mt-1 line-clamp-4 text-xs text-parchment/70">{spellDescription(selectedSpell, locale)}</p>
        </div>
      )}
    </div>
  );
}

export function SpellCardWidget({ spellId }: { spellId: string }) {
  const { locale } = useLocale();
  const [spell, setSpell] = useState<SrdSpell | null>(null);

  useEffect(() => {
    fetch("/srd-spells.json")
      .then((r) => r.json())
      .then((all: SrdSpell[]) => setSpell(all.find((s) => s.id === spellId) ?? null))
      .catch(() => setSpell(null));
  }, [spellId]);

  if (!spell) return <p className="p-2 text-xs text-parchment/50">?</p>;
  return (
    <div className="p-2">
      <h4 className="text-xs font-semibold text-gold">{spellName(spell, locale)}</h4>
      <p className="text-[10px] text-parchment/50">
        {spellSchool(spell, locale)} · {spellCastingTime(spell, locale)} · {spellDuration(spell, locale)}
      </p>
      <p className="mt-1 text-xs text-parchment/70">{spellDescription(spell, locale)}</p>
    </div>
  );
}
