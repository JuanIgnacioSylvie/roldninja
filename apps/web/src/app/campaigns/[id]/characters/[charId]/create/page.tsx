"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, User } from "lucide-react";
import {
  ABILITIES,
  ABILITY_LABELS,
  abilityModifier,
  BACKGROUNDS,
  CLASSES,
  isValidPointBuy,
  level1HitPoints,
  POINT_BUY_BUDGET,
  pointBuySpent,
  proficiencyBonus,
  SKILL_TO_ABILITY,
  SPECIES,
  STANDARD_ARRAY,
  type Ability,
  type AbilityScores,
  type CharacterSheet,
} from "@roldninja/domain";
import { useApi } from "@/infrastructure/composition";
import { assetUrl } from "@/infrastructure/config";
import { AppShell } from "@/components/AppShell";
import { Badge, Button, Card, Input, Label } from "@/components/ui";
import { useTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const baseScores = (): AbilityScores => ({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });

export default function CreateCharacterPage() {
  const router = useRouter();
  const api = useApi();
  const t = useTranslation();
  const { id, charId } = useParams<{ id: string; charId: string }>();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [speciesId, setSpeciesId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [backgroundId, setBackgroundId] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);

  const [method, setMethod] = useState<"pointbuy" | "array">("pointbuy");
  const [campaignMethodLoaded, setCampaignMethodLoaded] = useState(false);
  const [scores, setScores] = useState<AbilityScores>(baseScores());
  const [arrayAssign, setArrayAssign] = useState<Record<Ability, number | null>>({
    str: null, dex: null, con: null, int: null, wis: null, cha: null,
  });
  const [bgPlus2, setBgPlus2] = useState<Ability | null>(null);
  const [bgPlus1, setBgPlus1] = useState<Ability | null>(null);

  const species = SPECIES.find((s) => s.id === speciesId);
  const klass = CLASSES.find((c) => c.id === classId);
  const background = BACKGROUNDS.find((b) => b.id === backgroundId);

  useEffect(() => {
    void api.getCharacter(charId).then((c) => {
      if (c.name && c.name !== "Nuevo personaje") setName(c.name);
    });
  }, [charId, api]);

  useEffect(() => {
    void api.getCampaign(id).then((campaign) => {
      setMethod(campaign.abilityScoreMethod);
      setCampaignMethodLoaded(true);
    });
  }, [id, api]);

  // Puntuaciones finales (base + trasfondo).
  const finalScores = useMemo<AbilityScores>(() => {
    const out = { ...(method === "array" ? arrayToScores(arrayAssign) : scores) };
    if (bgPlus2) out[bgPlus2] += 2;
    if (bgPlus1) out[bgPlus1] += 1;
    return out;
  }, [method, scores, arrayAssign, bgPlus2, bgPlus1]);

  const spent = pointBuySpent(scores);
  const pbValid = isValidPointBuy(scores);
  const arrayComplete = Object.values(arrayAssign).every((v) => v !== null);

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : prev.length < (klass?.skillChoices.choose ?? 0)
          ? [...prev, skill]
          : prev,
    );
  }

  const canNext = [
    !!speciesId,
    !!classId && skills.length === (klass?.skillChoices.choose ?? 0),
    !!backgroundId && !!bgPlus2 && !!bgPlus1 && bgPlus2 !== bgPlus1,
    method === "pointbuy" ? pbValid : arrayComplete,
    name.trim().length > 0,
  ];

  async function finish() {
    const pb = proficiencyBonus(1);
    const sheet: CharacterSheet = {
      abilityScores: finalScores,
      skillProficiencies: [...skills, ...(background?.skillProficiencies ?? [])],
      savingThrows: (klass?.savingThrows ?? []).map((a) => ABILITY_LABELS[a]),
      maxHp: level1HitPoints(klass?.hitDie ?? 8, finalScores),
      currentHp: level1HitPoints(klass?.hitDie ?? 8, finalScores),
      armorClass: 10 + abilityModifier(finalScores.dex),
      speed: species?.speed ?? 30,
      proficiencyBonus: pb,
      hitDie: klass?.hitDie ?? 8,
      features: [...(species?.traits ?? []), background ? `Dote de origen: ${background.originFeat}` : ""].filter(Boolean),
      equipment: [],
      portraitUrl: portraitUrl ?? undefined,
    };

    await api.updateCharacter(charId, {
      name,
      species: species?.name,
      class: klass?.name,
      background: background?.name,
      level: 1,
      sheet,
      isComplete: true,
    });
    router.push(`/campaigns/${id}/characters`);
  }

  async function onPortraitUpload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setPortraitUrl(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <h1 className="mb-1 font-display text-2xl text-gold">{t.createCharacter.title}</h1>
        <p className="mb-4 text-sm text-parchment/60">{t.createCharacter.subtitle}</p>

        {/* Stepper */}
        <div className="mb-6 flex flex-wrap gap-2">
          {t.createCharacter.steps.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && setStep(i)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                i === step ? "bg-gold text-ink" : i < step ? "bg-arcane/60 text-white" : "bg-panel2 text-parchment/40",
              )}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <Card className="p-5">
          {step === 0 && (
            <Step title="Elegí tu especie">
              <Grid>
                {SPECIES.map((s) => (
                  <Selectable key={s.id} active={speciesId === s.id} onClick={() => setSpeciesId(s.id)}>
                    <div className="font-display text-gold">{s.name}</div>
                    <div className="text-xs text-parchment/50">{s.size} · {s.speed} pies</div>
                    <ul className="mt-1 text-xs text-parchment/60">
                      {s.traits.slice(0, 3).map((t) => <li key={t}>· {t}</li>)}
                    </ul>
                  </Selectable>
                ))}
              </Grid>
            </Step>
          )}

          {step === 1 && (
            <Step title="Elegí tu clase">
              <Grid>
                {CLASSES.map((c) => (
                  <Selectable key={c.id} active={classId === c.id} onClick={() => { setClassId(c.id); setSkills([]); }}>
                    <div className="font-display text-gold">{c.name}</div>
                    <div className="text-xs text-parchment/50">
                      d{c.hitDie} · {c.primaryAbility.map((a) => ABILITY_LABELS[a]).join("/")}
                    </div>
                  </Selectable>
                ))}
              </Grid>
              {klass && (
                <div className="mt-4">
                  <Label>Elegí {klass.skillChoices.choose} habilidades ({skills.length}/{klass.skillChoices.choose})</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(klass.skillChoices.from[0] === "Cualquiera"
                      ? Object.keys(SKILL_TO_ABILITY)
                      : klass.skillChoices.from
                    ).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs",
                          skills.includes(skill) ? "bg-arcane text-white" : "bg-panel2 text-parchment/60",
                        )}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Step>
          )}

          {step === 2 && (
            <Step title="Elegí tu trasfondo">
              <Grid>
                {BACKGROUNDS.map((b) => (
                  <Selectable key={b.id} active={backgroundId === b.id} onClick={() => { setBackgroundId(b.id); setBgPlus2(null); setBgPlus1(null); }}>
                    <div className="font-display text-gold">{b.name}</div>
                    <div className="text-xs text-parchment/50">Dote: {b.originFeat}</div>
                    <div className="text-xs text-parchment/60">{b.skillProficiencies.join(", ")}</div>
                  </Selectable>
                ))}
              </Grid>
              {background && (
                <div className="mt-4 space-y-2">
                  <Label>Asigná las mejoras de característica del trasfondo (+2 y +1)</Label>
                  <div className="flex flex-wrap gap-4">
                    <AbilityPicker label="+2" options={background.abilityScores} value={bgPlus2} onChange={setBgPlus2} />
                    <AbilityPicker label="+1" options={background.abilityScores} value={bgPlus1} onChange={setBgPlus1} />
                  </div>
                  {bgPlus2 && bgPlus2 === bgPlus1 && (
                    <p className="text-xs text-red-400">El +2 y el +1 deben ir a características distintas.</p>
                  )}
                </div>
              )}
            </Step>
          )}

          {step === 3 && (
            <Step title="Puntuaciones de característica">
              {campaignMethodLoaded && (
                <p className="mb-3 text-sm text-parchment/60">
                  {t.createCharacter.abilityScoreDmChoice}{" "}
                  <span className="text-gold">
                    {method === "pointbuy" ? t.createCharacter.abilityScorePointBuy : t.createCharacter.abilityScoreArray}
                  </span>
                </p>
              )}

              {method === "pointbuy" ? (
                <>
                  <p className={cn("mb-3 text-sm", pbValid ? "text-parchment/60" : "text-red-400")}>
                    Puntos usados: {Number.isFinite(spent) ? spent : "—"} / {POINT_BUY_BUDGET}
                  </p>
                  <div className="space-y-2">
                    {ABILITIES.map((a) => (
                      <div key={a} className="flex items-center gap-3">
                        <span className="w-28 text-sm">{ABILITY_LABELS[a]}</span>
                        <Button size="sm" variant="ghost" onClick={() => setScores((s) => ({ ...s, [a]: Math.max(8, s[a] - 1) }))}>−</Button>
                        <span className="w-8 text-center font-display text-lg text-gold">{scores[a]}</span>
                        <Button size="sm" variant="ghost" onClick={() => setScores((s) => ({ ...s, [a]: Math.min(15, s[a] + 1) }))}>+</Button>
                        <span className="text-xs text-parchment/40">
                          final {finalScores[a]} ({fmt(abilityModifier(finalScores[a]))})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="mb-2 text-sm text-parchment/60">Asigná {STANDARD_ARRAY.join(", ")} a cada característica.</p>
                  {ABILITIES.map((a) => (
                    <div key={a} className="flex items-center gap-3">
                      <span className="w-28 text-sm">{ABILITY_LABELS[a]}</span>
                      <select
                        className="rounded bg-panel2 px-2 py-1 text-sm"
                        value={arrayAssign[a] ?? ""}
                        onChange={(e) => setArrayAssign((prev) => ({ ...prev, [a]: e.target.value ? Number(e.target.value) : null }))}
                      >
                        <option value="">—</option>
                        {STANDARD_ARRAY.map((v) => (
                          <option key={v} value={v} disabled={usedArrayValue(arrayAssign, v, a)}>{v}</option>
                        ))}
                      </select>
                      <span className="text-xs text-parchment/40">final {finalScores[a]} ({fmt(abilityModifier(finalScores[a]))})</span>
                    </div>
                  ))}
                </div>
              )}
            </Step>
          )}

          {step === 4 && (
            <Step title={t.createCharacter.steps[4]!}>
              <Label htmlFor="charname">{t.createCharacter.nameLabel}</Label>
              <Input id="charname" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 mb-4" />

              <Label>{t.createCharacter.portrait}</Label>
              <p className="mb-2 text-xs text-parchment/50">{t.createCharacter.portraitHint}</p>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-panel2">
                  {portraitUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(portraitUrl)} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-parchment/30" />
                  )}
                </div>
                <label className="cursor-pointer rounded-md border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10">
                  <Upload className="mr-1 inline h-4 w-4" />
                  {uploading ? "..." : portraitUrl ? t.createCharacter.changeImage : t.createCharacter.uploadImage}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && void onPortraitUpload(e.target.files[0])}
                  />
                </label>
              </div>

              <Card className="bg-panel2/60 p-4 text-sm">
                <h3 className="mb-2 font-display text-gold">{t.createCharacter.summary}</h3>
                <p>{species?.name} · {klass?.name} · {background?.name} · Nivel 1</p>
                <p className="mt-1">PG: {level1HitPoints(klass?.hitDie ?? 8, finalScores)} · CA: {10 + abilityModifier(finalScores.dex)} · Velocidad: {species?.speed} pies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ABILITIES.map((a) => (
                    <Badge key={a} className="bg-panel text-parchment">
                      {ABILITY_LABELS[a].slice(0, 3)} {finalScores[a]} ({fmt(abilityModifier(finalScores[a]))})
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-xs text-parchment/60">Habilidades: {[...skills, ...(background?.skillProficiencies ?? [])].join(", ")}</p>
              </Card>
            </Step>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>{t.common.back}</Button>
            {step < t.createCharacter.steps.length - 1 ? (
              <Button variant="gold" disabled={!canNext[step]} onClick={() => setStep((s) => s + 1)}>{t.common.next}</Button>
            ) : (
              <Button variant="gold" disabled={!canNext[step]} onClick={finish}>{t.createCharacter.finish}</Button>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function fmt(mod: number) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
function arrayToScores(assign: Record<Ability, number | null>): AbilityScores {
  return {
    str: assign.str ?? 8, dex: assign.dex ?? 8, con: assign.con ?? 8,
    int: assign.int ?? 8, wis: assign.wis ?? 8, cha: assign.cha ?? 8,
  };
}
function usedArrayValue(assign: Record<Ability, number | null>, value: number, current: Ability) {
  return ABILITIES.some((a) => a !== current && assign[a] === value);
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-xl text-parchment">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
function Selectable({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border p-3 text-left transition",
        active ? "border-gold bg-gold/10" : "border-white/10 bg-panel2 hover:border-white/30",
      )}
    >
      {children}
    </button>
  );
}
function AbilityPicker({
  label, options, value, onChange,
}: {
  label: string; options: Ability[]; value: Ability | null; onChange: (a: Ability) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 flex gap-1">
        {options.map((a) => (
          <button
            key={a}
            onClick={() => onChange(a)}
            className={cn(
              "rounded px-2 py-1 text-xs",
              value === a ? "bg-gold text-ink" : "bg-panel2 text-parchment/60",
            )}
          >
            {ABILITY_LABELS[a].slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}
