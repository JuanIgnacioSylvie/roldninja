"use client";
import { Plus, Trash2, Upload, User } from "lucide-react";
import {
  ABILITIES,
  ABILITY_LABELS,
  abilityModifier,
  CONDITIONS_2024,
  proficiencyBonus,
  SKILL_TO_ABILITY,
  type Ability,
  type Attack,
  type CharacterSheet,
  type Coins,
} from "@roldninja/domain";
import { assetUrl } from "@/infrastructure/config";
import {
  clampLevel,
  d20Notation,
  emptyCoins,
  extractDiceNotation,
  fmtMod,
  parseAttackBonus,
  splitLines,
  splitList,
  toInt,
  updateSpellSlot,
  type SheetMeta,
} from "@/lib/character-sheet-utils";
import { cn } from "@/lib/utils";

const SKILLS_BY_ABILITY: Record<Ability, string[]> = {
  str: ["Atletismo"],
  dex: ["Acrobacias", "Juego de manos", "Sigilo"],
  con: [],
  int: ["Arcanos", "Historia", "Investigacion", "Naturaleza", "Religion"],
  wis: ["Trato con animales", "Medicina", "Percepcion", "Perspicacia", "Supervivencia"],
  cha: ["Engaño", "Interpretacion", "Intimidacion", "Persuasion"],
};

const COIN_LABELS: { key: keyof Coins; label: string }[] = [
  { key: "cp", label: "PC" },
  { key: "sp", label: "PP" },
  { key: "ep", label: "PE" },
  { key: "gp", label: "PO" },
  { key: "pp", label: "PPT" },
];

export interface CharacterSheetEditorProps {
  sheet: CharacterSheet;
  meta: SheetMeta;
  readOnly?: boolean;
  compact?: boolean;
  uploading?: boolean;
  /** Tiradas y acciones rápidas de sesión (chat + parches en vivo). */
  interactive?: boolean;
  actionsEnabled?: boolean;
  onRoll?: (notation: string, label?: string) => void;
  onSheetChange: (patch: Partial<CharacterSheet>) => void;
  onMetaChange: (patch: Partial<SheetMeta>) => void;
  onPortraitUpload?: (file: File) => void;
}

export function CharacterSheetEditor({
  sheet,
  meta,
  readOnly = false,
  compact = false,
  uploading = false,
  interactive = false,
  actionsEnabled = true,
  onRoll,
  onSheetChange,
  onMetaChange,
  onPortraitUpload,
}: CharacterSheetEditorProps) {
  const scores = sheet.abilityScores;
  const level = meta.level;
  const pb = sheet.proficiencyBonus ?? proficiencyBonus(level);
  const dexMod = abilityModifier(scores.dex);
  const initiative = dexMod + (sheet.initiativeBonus ?? 0);
  const perceptionProficient = sheet.skillProficiencies?.includes("Percepcion");
  const passivePerception =
    sheet.passivePerception ?? 10 + abilityModifier(scores.wis) + (perceptionProficient ? pb : 0);
  const coins = sheet.coins ?? emptyCoins();
  const ro = readOnly;
  const canAct = interactive && actionsEnabled && !!onRoll;

  function patchSheet(p: Partial<CharacterSheet>) {
    onSheetChange(p);
  }
  function patchMeta(p: Partial<SheetMeta>) {
    onMetaChange(p);
  }

  function roll(notation: string, label: string) {
    if (!canAct || !onRoll) return;
    onRoll(notation, label);
  }

  function adjustHp(delta: number) {
    if (!canAct) return;
    const next = Math.max(0, Math.min(sheet.maxHp, sheet.currentHp + delta));
    patchSheet({ currentHp: next });
  }

  function toggleCondition(name: string) {
    if (!canAct) return;
    const set = new Set(sheet.conditions ?? []);
    set.has(name) ? set.delete(name) : set.add(name);
    patchSheet({ conditions: [...set] });
  }

  function rollDeathSave() {
    if (!canAct || !onRoll) return;
    roll("1d20", "Salvación de muerte");
  }

  function rollHitDie() {
    if (!canAct || !onRoll) return;
    const remaining = Math.max(0, level - (sheet.hitDiceUsed ?? 0));
    if (remaining <= 0) return;
    const conMod = abilityModifier(scores.con);
    roll(`1d${sheet.hitDie}${conMod >= 0 ? `+${conMod}` : conMod}`, "Dado de golpe");
    patchSheet({ hitDiceUsed: (sheet.hitDiceUsed ?? 0) + 1 });
  }

  function skillMod(skill: string) {
    const ability = SKILL_TO_ABILITY[skill];
    const base = ability ? abilityModifier(scores[ability]) : 0;
    return base + (sheet!.skillProficiencies?.includes(skill) ? pb : 0);
  }
  function saveMod(ability: Ability) {
    const competent = sheet!.savingThrows?.includes(ABILITY_LABELS[ability]);
    return abilityModifier(scores[ability]) + (competent ? pb : 0);
  }
  function toggleSkill(skill: string) {
    if (ro) return;
    const set = new Set(sheet!.skillProficiencies ?? []);
    set.has(skill) ? set.delete(skill) : set.add(skill);
    patchSheet({ skillProficiencies: [...set] });
  }
  function toggleSave(ability: Ability) {
    if (ro) return;
    const label = ABILITY_LABELS[ability];
    const set = new Set(sheet!.savingThrows ?? []);
    set.has(label) ? set.delete(label) : set.add(label);
    patchSheet({ savingThrows: [...set] });
  }

  return (
    <div className={cn("rounded-lg bg-[#f5efdd] text-[#33291a]", compact ? "p-2 text-[11px]" : "p-4 shadow-2xl sm:p-6")}>
        {/* Encabezado */}
        <header className="mb-4 grid grid-cols-1 gap-3 border-b-2 border-[#7c2929]/50 pb-4 lg:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-3">
            <div className={cn("relative shrink-0 overflow-hidden rounded-full border-2 border-[#7c2929]/40 bg-[#e7ddc2]", compact ? "h-16 w-16" : "h-24 w-24")}>
              {sheet.portraitUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={assetUrl(sheet.portraitUrl)} alt={meta.name} className="h-full w-full object-cover" />
              ) : (
                <User className="absolute inset-0 m-auto h-10 w-10 text-[#7c2929]/30" />
              )}
              {!ro && onPortraitUpload && (
                <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/50 py-0.5 text-center text-[10px] text-white">
                  {uploading ? "..." : <Upload className="mx-auto h-3 w-3" />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && onPortraitUpload(e.target.files[0])}
                  />
                </label>
              )}
            </div>
            <div className="min-w-0">
              <SheetInput
                value={meta.name}
                onChange={(v) => patchMeta({ name: v })}
                readOnly={ro}
                placeholder="Nombre del personaje"
                className={cn("font-display font-bold text-[#7c2929]", compact ? "text-lg" : "text-2xl")}
              />
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xs uppercase tracking-wide text-[#6b5a3a]">
                <FieldInline label="Clase" value={meta.class} onChange={(v) => patchMeta({ class: v })} ro={ro} />
                <FieldInline label="Nivel" value={String(meta.level)} onChange={(v) => patchMeta({ level: clampLevel(v) })} ro={ro} numeric width="w-10" />
                <FieldInline label="Subclase" value={sheet.subclass ?? ""} onChange={(v) => patchSheet({ subclass: v })} ro={ro} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
            <FieldStacked label="Especie" value={meta.species} onChange={(v) => patchMeta({ species: v })} ro={ro} />
            <FieldStacked label="Trasfondo" value={meta.background} onChange={(v) => patchMeta({ background: v })} ro={ro} />
            <FieldStacked label="Alineamiento" value={sheet.alignment ?? ""} onChange={(v) => patchSheet({ alignment: v })} ro={ro} />
            <FieldStacked label="Puntos de experiencia" value={String(sheet.xp ?? 0)} numeric onChange={(v) => patchSheet({ xp: toInt(v) })} ro={ro} />
          </div>
        </header>

        <div className={cn("grid grid-cols-1 gap-4", !compact && "lg:grid-cols-[200px_1fr_1fr]")}>
          {/* Columna 1: características + salvaciones + habilidades */}
          <div className="space-y-3">
            <Box>
              <div className="grid grid-cols-2 gap-2">
                {ABILITIES.map((a) => (
                  <AbilityBox
                    key={a}
                    label={ABILITY_LABELS[a]}
                    score={scores[a]}
                    ro={ro}
                    rollable={canAct}
                    onRoll={() => roll(d20Notation(abilityModifier(scores[a])), `Característica ${ABILITY_LABELS[a]}`)}
                    onChange={(v) => patchSheet({ abilityScores: { ...scores, [a]: v } })}
                  />
                ))}
              </div>
            </Box>

            <Box title="Tiradas de salvación">
              <div className="space-y-1">
                {ABILITIES.map((a) => (
                  <ProfRow
                    key={a}
                    active={!!sheet.savingThrows?.includes(ABILITY_LABELS[a])}
                    onToggle={() => toggleSave(a)}
                    mod={saveMod(a)}
                    label={ABILITY_LABELS[a]}
                    rollable={canAct}
                    onRoll={() => roll(d20Notation(saveMod(a)), `Salvación ${ABILITY_LABELS[a]}`)}
                  />
                ))}
              </div>
            </Box>

            <Box title="Habilidades">
              <div className="space-y-0.5">
                {ABILITIES.flatMap((a) =>
                  SKILLS_BY_ABILITY[a].map((skill) => (
                    <ProfRow
                      key={skill}
                      active={!!sheet.skillProficiencies?.includes(skill)}
                      onToggle={() => toggleSkill(skill)}
                      mod={skillMod(skill)}
                      label={skill}
                      sub={ABILITY_LABELS[a].slice(0, 3)}
                      rollable={canAct}
                      onRoll={() => roll(d20Notation(skillMod(skill)), skill)}
                    />
                  )),
                )}
              </div>
            </Box>

            <Box>
              <StatLine label="Percepción pasiva" value={passivePerception} />
              <StatLine label="Bonif. de competencia" value={fmtMod(pb)} />
            </Box>
          </div>

          {/* Columna 2: combate, vida, ataques */}
          <div className="space-y-3">
            <Box>
              <div className="grid grid-cols-3 gap-2 text-center">
                <BigStat label="Clase de armadura" value={sheet.armorClass} ro={ro} onChange={(v) => patchSheet({ armorClass: toInt(v) })} />
                <BigStat
                  label="Iniciativa"
                  value={fmtMod(initiative)}
                  readOnlyValue
                  rollable={canAct}
                  onRoll={() => roll(d20Notation(initiative), "Iniciativa")}
                />
                <BigStat label="Velocidad" value={sheet.speed} ro={ro} onChange={(v) => patchSheet({ speed: toInt(v) })} />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <SmallStat label="Tamaño" value={sheet.size ?? "Mediano"} ro={ro} onChange={(v) => patchSheet({ size: v })} />
                <SmallStat label="Comp." value={fmtMod(pb)} readOnlyValue />
                <ToggleStat
                  label="Insp. heroica"
                  active={!!sheet.heroicInspiration}
                  ro={ro}
                  onToggle={() => patchSheet({ heroicInspiration: !sheet.heroicInspiration })}
                />
              </div>
            </Box>

            <Box title="Puntos de golpe">
              <div className="grid grid-cols-3 gap-2 text-center">
                <NumBox label="Actuales" value={sheet.currentHp} ro={ro} onChange={(v) => patchSheet({ currentHp: toInt(v) })} />
                <NumBox label="Máximos" value={sheet.maxHp} ro={ro} onChange={(v) => patchSheet({ maxHp: toInt(v) })} />
                <NumBox label="Temporales" value={sheet.tempHp ?? 0} ro={ro} onChange={(v) => patchSheet({ tempHp: toInt(v) })} />
              </div>
              {canAct && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  <QuickBtn onClick={() => adjustHp(-5)}>-5</QuickBtn>
                  <QuickBtn onClick={() => adjustHp(-1)}>-1</QuickBtn>
                  <QuickBtn onClick={() => adjustHp(+1)}>+1</QuickBtn>
                  <QuickBtn onClick={() => adjustHp(+5)}>+5</QuickBtn>
                </div>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded border border-[#b5a780] bg-[#fbf6e8] p-2">
                  <div className="text-[10px] uppercase text-[#6b5a3a]">Dados de golpe</div>
                  <div className="flex items-center gap-1 text-sm">
                    <span>d{sheet.hitDie}</span>
                    <span className="text-[#6b5a3a]">·</span>
                    <span>{Math.max(0, level - (sheet.hitDiceUsed ?? 0))}/{level}</span>
                  </div>
                  {canAct && (
                    <button
                      type="button"
                      onClick={rollHitDie}
                      disabled={level - (sheet.hitDiceUsed ?? 0) <= 0}
                      className="mt-1 w-full rounded bg-[#7c2929]/15 py-0.5 text-[10px] font-semibold text-[#7c2929] hover:bg-[#7c2929]/25 disabled:opacity-40"
                    >
                      Gastar y tirar
                    </button>
                  )}
                </div>
                <div className="rounded border border-[#b5a780] bg-[#fbf6e8] p-2">
                  <div className="text-[10px] uppercase text-[#6b5a3a]">Salvaciones de muerte</div>
                  <div className="flex items-center gap-3 text-xs">
                    <Pips label="Éx." count={sheet.deathSaves?.successes ?? 0} onChange={(n) => !ro && patchSheet({ deathSaves: { successes: n, failures: sheet.deathSaves?.failures ?? 0 } })} color="bg-green-600" />
                    <Pips label="Fa." count={sheet.deathSaves?.failures ?? 0} onChange={(n) => !ro && patchSheet({ deathSaves: { successes: sheet.deathSaves?.successes ?? 0, failures: n } })} color="bg-red-600" />
                  </div>
                  {canAct && (
                    <button
                      type="button"
                      onClick={rollDeathSave}
                      className="mt-1 w-full rounded bg-[#7c2929]/15 py-0.5 text-[10px] font-semibold text-[#7c2929] hover:bg-[#7c2929]/25"
                    >
                      Tirar salvación
                    </button>
                  )}
                </div>
              </div>
            </Box>

            {interactive && (
              <Box title="Condiciones">
                <div className="flex flex-wrap gap-1">
                  {CONDITIONS_2024.map((c) => {
                    const active = sheet.conditions?.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCondition(c)}
                        disabled={!canAct}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] transition",
                          active ? "bg-[#7c2929] text-white" : "bg-[#fbf6e8] text-[#6b5a3a] border border-[#b5a780]",
                          canAct && "hover:border-[#7c2929]/60",
                          !canAct && "opacity-60",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </Box>
            )}

            <Box title="Armas y trucos de daño">
              <AttacksTable attacks={sheet.attacks ?? []} ro={ro} canAct={canAct} onRoll={roll} onChange={(attacks) => patchSheet({ attacks })} />
            </Box>

            <Box title="Entrenamiento y competencias con equipo">
              <ArmorTrainingRow sheet={sheet} ro={ro} onChange={patchSheet} />
              <ListField label="Armas" value={sheet.weaponProficiencies ?? ""} onChange={(v) => patchSheet({ weaponProficiencies: v })} ro={ro} />
              <ListField label="Herramientas" value={sheet.toolProficiencies ?? ""} onChange={(v) => patchSheet({ toolProficiencies: v })} ro={ro} />
              <ListField label="Idiomas" value={(sheet.languages ?? []).join(", ")} onChange={(v) => patchSheet({ languages: splitList(v) })} ro={ro} />
            </Box>
          </div>

          {/* Columna 3: rasgos, equipo, conjuros */}
          <div className="space-y-3">
            <Box title="Rasgos de especie">
              <MultilineField value={(sheet.speciesTraits ?? []).join("\n")} onChange={(v) => patchSheet({ speciesTraits: splitLines(v) })} ro={ro} placeholder="Un rasgo por línea" />
            </Box>
            <Box title="Rasgos de clase">
              <MultilineField value={(sheet.classFeatures ?? sheet.features ?? []).join("\n")} onChange={(v) => patchSheet({ classFeatures: splitLines(v) })} ro={ro} placeholder="Un rasgo por línea" />
            </Box>
            <Box title="Dotes">
              <MultilineField value={(sheet.feats ?? []).join("\n")} onChange={(v) => patchSheet({ feats: splitLines(v) })} ro={ro} placeholder="Una dote por línea" />
            </Box>

            <Box title="Equipo">
              <MultilineField value={(sheet.equipment ?? []).join("\n")} onChange={(v) => patchSheet({ equipment: splitLines(v) })} ro={ro} placeholder="Un objeto por línea" rows={5} />
              <div className="mt-2 grid grid-cols-5 gap-1">
                {COIN_LABELS.map(({ key, label }) => (
                  <div key={key} className="rounded border border-[#b5a780] bg-[#fbf6e8] p-1 text-center">
                    <div className="text-[10px] uppercase text-[#6b5a3a]">{label}</div>
                    <SheetInput
                      value={String(coins[key])}
                      onChange={(v) => patchSheet({ coins: { ...coins, [key]: toInt(v) } })}
                      readOnly={ro}
                      numeric
                      className="text-center text-sm"
                    />
                  </div>
                ))}
              </div>
            </Box>

            <Box title="Conjuros">
              <div className="grid grid-cols-3 gap-2 text-center">
                <SmallStat label="Aptitud" value={sheet.spellcastingAbility ?? "—"} ro={ro} onChange={(v) => patchSheet({ spellcastingAbility: v })} />
                <NumBox label="CD salv." value={sheet.spellSaveDc ?? 0} ro={ro} onChange={(v) => patchSheet({ spellSaveDc: toInt(v) })} />
                <NumBox
                  label="Bonif. atq."
                  value={sheet.spellAttackBonus ?? 0}
                  ro={ro}
                  rollable={canAct}
                  onRoll={() => roll(d20Notation(sheet.spellAttackBonus ?? 0), "Ataque con conjuro")}
                  onChange={(v) => patchSheet({ spellAttackBonus: toInt(v) })}
                />
              </div>
              <div className="mt-2">
                <div className="mb-1 text-[10px] uppercase text-[#6b5a3a]">Espacios de conjuro</div>
                <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const lvl = i + 1;
                    const slot = sheet.spellSlots?.[lvl] ?? { total: 0, used: 0 };
                    return (
                      <div key={lvl} className="flex items-center gap-1 rounded border border-[#b5a780] bg-[#fbf6e8] px-1 py-0.5 text-xs">
                        <span className="text-[#7c2929]">N{lvl}</span>
                        <SheetInput value={String(slot.used)} numeric readOnly={ro} onChange={(v) => patchSheet({ spellSlots: updateSpellSlot(sheet, lvl, { used: toInt(v) }) })} className="w-6 text-center" />
                        <span className="text-[#6b5a3a]">/</span>
                        <SheetInput value={String(slot.total)} numeric readOnly={ro} onChange={(v) => patchSheet({ spellSlots: updateSpellSlot(sheet, lvl, { total: toInt(v) }) })} className="w-6 text-center" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-[10px] uppercase text-[#6b5a3a]">Trucos</div>
                <MultilineField value={(sheet.cantrips ?? []).join("\n")} onChange={(v) => patchSheet({ cantrips: splitLines(v) })} ro={ro} placeholder="Un truco por línea" rows={3} />
              </div>
              <div className="mt-2">
                <div className="text-[10px] uppercase text-[#6b5a3a]">Conjuros preparados</div>
                <MultilineField value={(sheet.preparedSpells ?? sheet.spells ?? []).join("\n")} onChange={(v) => patchSheet({ preparedSpells: splitLines(v) })} ro={ro} placeholder="Un conjuro por línea" rows={5} />
              </div>
            </Box>
          </div>
        </div>

        {/* Pie: historia y aspecto */}
        <div className={cn("mt-4 grid grid-cols-1 gap-3 border-t-2 border-[#7c2929]/50 pt-4", !compact && "lg:grid-cols-3")}>
          <Box title="Aspecto">
            <MultilineField value={sheet.appearance ?? ""} onChange={(v) => patchSheet({ appearance: v })} ro={ro} rows={5} placeholder="Descripción física, edad, altura..." />
          </Box>
          <Box title="Personalidad e historia">
            <MultilineField value={sheet.personality ?? ""} onChange={(v) => patchSheet({ personality: v })} ro={ro} rows={5} placeholder="Rasgos, ideales, vínculos, defectos..." />
            <div className="mt-2">
              <div className="text-[10px] uppercase text-[#6b5a3a]">Trasfondo</div>
              <MultilineField value={sheet.backstory ?? ""} onChange={(v) => patchSheet({ backstory: v })} ro={ro} rows={4} />
            </div>
          </Box>
          <Box title="Objetos mágicos sintonizados">
            <MultilineField value={(sheet.attunedItems ?? []).join("\n")} onChange={(v) => patchSheet({ attunedItems: splitLines(v) })} ro={ro} rows={3} placeholder="Máximo 3" />
            <div className="mt-2">
              <div className="text-[10px] uppercase text-[#6b5a3a]">Notas</div>
              <MultilineField value={sheet.notes ?? ""} onChange={(v) => patchSheet({ notes: v })} ro={ro} rows={4} />
            </div>
          </Box>
        </div>
    </div>
  );
}

/* ---------- componentes de presentación ---------- */

function Box({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[#b5a780] bg-[#efe6cc] p-2">
      {title && (
        <h3 className="mb-2 border-b border-[#7c2929]/30 pb-1 text-center text-[11px] font-bold uppercase tracking-wide text-[#7c2929]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function SheetInput({
  value,
  onChange,
  readOnly,
  numeric,
  placeholder,
  className,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  numeric?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      inputMode={numeric ? "numeric" : undefined}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "w-full border-b border-transparent bg-transparent px-0.5 text-[#33291a] outline-none placeholder:text-[#8a7a55]",
        !readOnly && "focus:border-[#7c2929]/60 hover:border-[#b5a780]",
        className,
      )}
    />
  );
}

function FieldInline({
  label, value, onChange, ro, numeric, width,
}: { label: string; value: string; onChange: (v: string) => void; ro: boolean; numeric?: boolean; width?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="text-[#6b5a3a]">{label}:</span>
      <span className={cn("font-semibold normal-case text-[#33291a]", width)}>
        <SheetInput value={value} onChange={onChange} readOnly={ro} numeric={numeric} className="text-sm" />
      </span>
    </span>
  );
}

function FieldStacked({
  label, value, onChange, ro, numeric,
}: { label: string; value: string; onChange: (v: string) => void; ro: boolean; numeric?: boolean }) {
  return (
    <div className="border-b border-[#b5a780]/60">
      <SheetInput value={value} onChange={onChange} readOnly={ro} numeric={numeric} className="text-sm font-semibold" />
      <div className="text-[9px] uppercase tracking-wide text-[#6b5a3a]">{label}</div>
    </div>
  );
}

function AbilityBox({
  label, score, onChange, ro, rollable, onRoll,
}: { label: string; score: number; onChange: (v: number) => void; ro: boolean; rollable?: boolean; onRoll?: () => void }) {
  const mod = abilityModifier(score);
  return (
    <div className="flex flex-col items-center rounded-md border border-[#7c2929]/40 bg-[#fbf6e8] p-1">
      <div className="text-[9px] font-bold uppercase tracking-wide text-[#7c2929]">{label.slice(0, 3)}</div>
      {rollable ? (
        <button type="button" onClick={onRoll} className="font-display text-xl font-bold text-[#33291a] hover:text-[#7c2929]" title="Tirar">
          {fmtMod(mod)}
        </button>
      ) : (
        <div className="font-display text-xl font-bold text-[#33291a]">{fmtMod(mod)}</div>
      )}
      <input
        value={score}
        readOnly={ro}
        inputMode="numeric"
        onChange={(e) => onChange(toInt(e.target.value))}
        className="w-10 rounded-full border border-[#b5a780] bg-[#efe6cc] text-center text-xs outline-none focus:border-[#7c2929]"
      />
    </div>
  );
}

function ProfRow({
  active, onToggle, mod, label, sub, rollable, onRoll,
}: { active: boolean; onToggle: () => void; mod: number; label: string; sub?: string; rollable?: boolean; onRoll?: () => void }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "h-3 w-3 shrink-0 rounded-full border border-[#7c2929]/60",
          active ? "bg-[#7c2929]" : "bg-transparent",
        )}
        title="Competente"
      />
      {rollable ? (
        <button type="button" onClick={onRoll} className="w-7 text-right font-semibold text-[#33291a] hover:text-[#7c2929]" title="Tirar">
          {fmtMod(mod)}
        </button>
      ) : (
        <span className="w-7 text-right font-semibold text-[#33291a]">{fmtMod(mod)}</span>
      )}
      <span className="flex-1 truncate text-[#33291a]">{label}</span>
      {sub && <span className="text-[9px] uppercase text-[#8a7a55]">{sub}</span>}
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-xs">
      <span className="text-[#6b5a3a]">{label}</span>
      <span className="font-semibold text-[#33291a]">{value}</span>
    </div>
  );
}

function BigStat({
  label, value, onChange, ro, readOnlyValue, rollable, onRoll,
}: { label: string; value: React.ReactNode; onChange?: (v: string) => void; ro?: boolean; readOnlyValue?: boolean; rollable?: boolean; onRoll?: () => void }) {
  return (
    <div className="rounded-md border border-[#7c2929]/40 bg-[#fbf6e8] p-1">
      {readOnlyValue ? (
        rollable ? (
          <button type="button" onClick={onRoll} className="w-full font-display text-xl font-bold text-[#33291a] hover:text-[#7c2929]" title="Tirar">
            {value}
          </button>
        ) : (
          <div className="font-display text-xl font-bold text-[#33291a]">{value}</div>
        )
      ) : (
        <input
          value={String(value)}
          readOnly={ro}
          inputMode="numeric"
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-center font-display text-xl font-bold text-[#33291a] outline-none"
        />
      )}
      <div className="text-[9px] uppercase leading-tight text-[#6b5a3a]">{label}</div>
    </div>
  );
}

function SmallStat({
  label, value, onChange, ro, readOnlyValue,
}: { label: string; value: string; onChange?: (v: string) => void; ro?: boolean; readOnlyValue?: boolean }) {
  return (
    <div className="rounded-md border border-[#b5a780] bg-[#fbf6e8] p-1">
      {readOnlyValue ? (
        <div className="text-sm font-semibold text-[#33291a]">{value}</div>
      ) : (
        <SheetInput value={value} onChange={onChange} readOnly={ro} className="text-center text-sm font-semibold" />
      )}
      <div className="text-[9px] uppercase leading-tight text-[#6b5a3a]">{label}</div>
    </div>
  );
}

function NumBox({
  label, value, onChange, ro, rollable, onRoll,
}: { label: string; value: number; onChange?: (v: string) => void; ro?: boolean; rollable?: boolean; onRoll?: () => void }) {
  return (
    <div className="rounded-md border border-[#b5a780] bg-[#fbf6e8] p-1">
      {rollable ? (
        <button type="button" onClick={onRoll} className="w-full font-display text-lg font-bold text-[#33291a] hover:text-[#7c2929]" title="Tirar">
          {value}
        </button>
      ) : (
        <input
          value={value}
          readOnly={ro}
          inputMode="numeric"
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-center font-display text-lg font-bold text-[#33291a] outline-none"
        />
      )}
      <div className="text-[9px] uppercase leading-tight text-[#6b5a3a]">{label}</div>
    </div>
  );
}

function QuickBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-[#7c2929]/40 bg-[#fbf6e8] px-2 py-0.5 text-xs font-semibold text-[#7c2929] hover:bg-[#7c2929]/10"
    >
      {children}
    </button>
  );
}

function ToggleStat({
  label, active, onToggle, ro,
}: { label: string; active: boolean; onToggle: () => void; ro: boolean }) {
  return (
    <button
      onClick={() => !ro && onToggle()}
      className={cn(
        "rounded-md border p-1 transition",
        active ? "border-[#7c2929] bg-[#7c2929]/15" : "border-[#b5a780] bg-[#fbf6e8]",
      )}
    >
      <div className={cn("font-display text-lg font-bold", active ? "text-[#7c2929]" : "text-[#b5a780]")}>
        {active ? "✦" : "—"}
      </div>
      <div className="text-[9px] uppercase leading-tight text-[#6b5a3a]">{label}</div>
    </button>
  );
}

function Pips({
  label, count, onChange, color,
}: { label: string; count: number; onChange: (n: number) => void; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[#6b5a3a]">{label}</span>
      {[1, 2, 3].map((i) => (
        <button
          key={i}
          onClick={() => onChange(count >= i ? i - 1 : i)}
          className={cn("h-3 w-3 rounded-full border border-[#7c2929]/50", i <= count ? color : "bg-transparent")}
        />
      ))}
    </div>
  );
}

function ListField({
  label, value, onChange, ro,
}: { label: string; value: string; onChange: (v: string) => void; ro: boolean }) {
  return (
    <div className="mt-1 flex items-baseline gap-1 text-xs">
      <span className="shrink-0 text-[#6b5a3a]">{label}:</span>
      <SheetInput value={value} onChange={onChange} readOnly={ro} className="text-xs" />
    </div>
  );
}

function MultilineField({
  value, onChange, ro, placeholder, rows = 4,
}: { value: string; onChange: (v: string) => void; ro: boolean; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      readOnly={ro}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full resize-y rounded border border-[#b5a780]/60 bg-[#fbf6e8] p-1.5 text-xs text-[#33291a] outline-none placeholder:text-[#8a7a55]",
        !ro && "focus:border-[#7c2929]/60",
      )}
    />
  );
}

function ArmorTrainingRow({
  sheet, onChange, ro,
}: { sheet: CharacterSheet; onChange: (p: Partial<CharacterSheet>) => void; ro: boolean }) {
  const at = sheet.armorTraining ?? { light: false, medium: false, heavy: false, shields: false };
  const items: { key: keyof typeof at; label: string }[] = [
    { key: "light", label: "Ligeras" },
    { key: "medium", label: "Medias" },
    { key: "heavy", label: "Pesadas" },
    { key: "shields", label: "Escudos" },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => !ro && onChange({ armorTraining: { ...at, [key]: !at[key] } })}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] transition",
            at[key] ? "bg-[#7c2929] text-white" : "bg-[#fbf6e8] text-[#6b5a3a] border border-[#b5a780]",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function AttacksTable({
  attacks, onChange, ro, canAct, onRoll,
}: {
  attacks: Attack[];
  onChange: (a: Attack[]) => void;
  ro: boolean;
  canAct?: boolean;
  onRoll?: (notation: string, label: string) => void;
}) {
  function update(i: number, patch: Partial<Attack>) {
    onChange(attacks.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }
  function add() {
    onChange([...attacks, { name: "", bonus: "", damage: "", notes: "" }]);
  }
  function remove(i: number) {
    onChange(attacks.filter((_, idx) => idx !== i));
  }
  function rollAttack(a: Attack) {
    if (!canAct || !onRoll) return;
    const parsed = parseAttackBonus(a.bonus);
    const label = a.name || "Ataque";
    if (parsed?.isDC) {
      onRoll("1d20", `${label} (CD ${parsed.dc})`);
    } else if (parsed) {
      onRoll(d20Notation(parsed.mod), `${label} — ataque`);
    }
  }
  function rollDamage(a: Attack) {
    if (!canAct || !onRoll) return;
    const notation = extractDiceNotation(a.damage);
    if (notation) onRoll(notation, `${a.name || "Ataque"} — daño`);
  }
  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-1 border-b border-[#7c2929]/30 pb-1 text-[9px] font-bold uppercase text-[#6b5a3a]">
        <span>Nombre</span>
        <span>Atq./CD</span>
        <span>Daño y tipo</span>
        <span />
      </div>
      {attacks.length === 0 && <p className="py-1 text-center text-[11px] text-[#8a7a55]">Sin ataques.</p>}
      {attacks.map((a, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-1 border-b border-[#b5a780]/40 py-0.5">
          <SheetInput value={a.name} onChange={(v) => update(i, { name: v })} readOnly={ro} className="text-xs" />
          <span className="w-12">
            {canAct && ro && a.bonus ? (
              <button type="button" onClick={() => rollAttack(a)} className="w-full text-center text-xs font-semibold text-[#7c2929] hover:underline" title="Tirar ataque">
                {a.bonus}
              </button>
            ) : (
              <SheetInput value={a.bonus} onChange={(v) => update(i, { bonus: v })} readOnly={ro} className="text-center text-xs" />
            )}
          </span>
          {canAct && ro && extractDiceNotation(a.damage) ? (
            <button type="button" onClick={() => rollDamage(a)} className="truncate text-left text-xs text-[#7c2929] hover:underline" title="Tirar daño">
              {a.damage}
            </button>
          ) : (
            <SheetInput value={a.damage} onChange={(v) => update(i, { damage: v })} readOnly={ro} className="text-xs" />
          )}
          {!ro ? (
            <button type="button" onClick={() => remove(i)} className="text-[#7c2929]/60 hover:text-[#7c2929]">
              <Trash2 className="h-3 w-3" />
            </button>
          ) : (
            <span />
          )}
        </div>
      ))}
      {!ro && (
        <button type="button" onClick={add} className="mt-1 flex items-center gap-1 text-[11px] text-[#7c2929] hover:underline">
          <Plus className="h-3 w-3" /> Agregar ataque
        </button>
      )}
    </div>
  );
}
