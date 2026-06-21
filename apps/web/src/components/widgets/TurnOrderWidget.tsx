"use client";
import { useState } from "react";
import {
  Swords,
  Coffee,
  SkipForward,
  ArrowDownWideNarrow,
  UserPlus,
  Flag,
  GripVertical,
  X,
} from "lucide-react";
import type { CampaignStateDTO } from "@roldninja/contracts";
import type { InitiativeEntry } from "@roldninja/domain";
import { assetUrl } from "@/infrastructure/config";
import { useTranslation } from "@/i18n/LocaleProvider";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface TurnOrderWidgetProps {
  state: CampaignStateDTO | null;
  isDM: boolean;
  isMyTurn: boolean;
  currentTurnIndex: number;
  onSetMode: (mode: "FREE" | "COMBAT") => void;
  onNextTurn: () => void;
  onReorder: (order: InitiativeEntry[]) => void;
  onSort: () => void;
}

function entryKey(entry: InitiativeEntry, index: number) {
  return `${entry.characterId ?? "npc"}-${entry.name}-${index}`;
}

export function TurnOrderWidget({
  state,
  isDM,
  isMyTurn,
  currentTurnIndex,
  onSetMode,
  onNextTurn,
  onReorder,
  onSort,
}: TurnOrderWidgetProps) {
  const t = useTranslation();
  const inCombat = state?.mode === "COMBAT";
  const initiative = state?.initiative ?? [];
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [npcName, setNpcName] = useState("");
  const [npcInit, setNpcInit] = useState(10);
  const [addingNpc, setAddingNpc] = useState(false);

  function updateEntry(index: number, patch: Partial<InitiativeEntry>) {
    onReorder(initiative.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }

  function removeEntry(index: number) {
    onReorder(initiative.filter((_, i) => i !== index));
  }

  function addNpc(e: React.FormEvent) {
    e.preventDefault();
    if (!npcName.trim()) return;
    onReorder([
      ...initiative,
      {
        characterId: null,
        userId: null,
        name: npcName.trim(),
        initiative: npcInit,
        pending: false,
        color: "#ca8a04",
        kind: "npc",
      },
    ]);
    setNpcName("");
    setNpcInit(10);
    setAddingNpc(false);
  }

  function handleDrop(targetIndex: number) {
    if (!isDM || dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const next = [...initiative];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved!);
    onReorder(next);
    setDragIndex(null);
  }

  if (!inCombat) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
        <p className="text-sm text-parchment/50">{t.turnOrder.freeMode}</p>
        {isDM && (
          <Button size="sm" variant="danger" onClick={() => onSetMode("COMBAT")}>
            <Swords className="mr-1 inline h-3 w-3" /> {t.dashboard.combat.start}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            "bg-blood text-white",
          )}
        >
          {t.dashboard.combat.combat} {state?.round}
        </span>

        {isDM ? (
          <>
            <Button size="sm" variant="ghost" onClick={() => onSetMode("FREE")}>
              <Coffee className="mr-1 inline h-3 w-3" /> {t.dashboard.combat.end}
            </Button>
            <Button size="sm" variant="ghost" onClick={onSort} title={t.dashboard.combat.sort}>
              <ArrowDownWideNarrow className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAddingNpc((v) => !v)} title={t.dashboard.combat.addNpc}>
              <UserPlus className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="gold" onClick={onNextTurn}>
              <SkipForward className="mr-1 inline h-3 w-3" /> {t.dashboard.combat.nextTurn}
            </Button>
          </>
        ) : (
          isMyTurn && (
            <Button size="sm" variant="gold" onClick={onNextTurn}>
              <Flag className="mr-1 inline h-3 w-3" /> {t.dashboard.combat.endMyTurn}
            </Button>
          )
        )}
      </div>

      {isDM && addingNpc && (
        <form onSubmit={addNpc} className="flex flex-wrap items-center gap-1 border-b border-white/10 pb-2">
          <input
            value={npcName}
            onChange={(e) => setNpcName(e.target.value)}
            placeholder={t.dashboard.combat.npcPlaceholder}
            className="min-w-[120px] flex-1 rounded bg-panel2 px-2 py-1 text-xs"
            autoFocus
          />
          <input
            type="number"
            value={npcInit}
            onChange={(e) => setNpcInit(+e.target.value)}
            className="w-16 rounded bg-panel2 px-2 py-1 text-xs"
            title={t.turnOrder.initiative}
          />
          <Button size="sm" variant="gold" type="submit">
            {t.common.add}
          </Button>
        </form>
      )}

      {initiative.length === 0 ? (
        <p className="flex-1 text-center text-sm text-parchment/50">{t.turnOrder.emptyList}</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {initiative.map((entry, i) => {
            const active = i === currentTurnIndex;
            const kind = entry.kind ?? (entry.characterId ? "player" : "npc");
            return (
              <li
                key={entryKey(entry, i)}
                draggable={isDM}
                onDragStart={() => isDM && setDragIndex(i)}
                onDragEnd={() => setDragIndex(null)}
                onDragOver={(e) => {
                  if (isDM) e.preventDefault();
                }}
                onDrop={() => handleDrop(i)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-1.5",
                  active ? "border-gold bg-gold/10" : "border-white/10 bg-panel2/60",
                  dragIndex === i && "opacity-50",
                  isDM && "cursor-grab active:cursor-grabbing",
                )}
              >
                {isDM && <GripVertical className="h-4 w-4 shrink-0 text-parchment/30" />}

                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full",
                    active ? "ring-2 ring-gold" : "ring-1 ring-white/20",
                    kind === "monster" && !active && "ring-red-500/40",
                  )}
                  style={{ backgroundColor: entry.imageUrl ? undefined : entry.color ?? "#6366f1" }}
                >
                  {entry.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(entry.imageUrl)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white">{entry.name.charAt(0)}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm", active ? "font-semibold text-gold" : "text-parchment")}>
                    {entry.name}
                    {entry.pending && <span className="ml-1 text-yellow-400">…</span>}
                  </p>
                  {active && <p className="text-[10px] text-gold/80">{t.turnOrder.currentTurn}</p>}
                </div>

                {isDM ? (
                  <>
                    <input
                      type="number"
                      value={entry.pending ? "" : entry.initiative}
                      disabled={entry.pending}
                      onChange={(e) => updateEntry(i, { initiative: +e.target.value || 0, pending: false })}
                      className="w-14 rounded bg-panel px-1 py-0.5 text-center text-xs text-parchment"
                      title={t.turnOrder.initiative}
                    />
                    <button
                      type="button"
                      onClick={() => removeEntry(i)}
                      className="rounded p-1 text-parchment/40 hover:bg-red-900/40 hover:text-red-300"
                      aria-label={t.common.close}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  !entry.pending && (
                    <span className="rounded bg-panel px-2 py-0.5 text-xs font-bold text-parchment/80">
                      {entry.initiative}
                    </span>
                  )
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isDM && initiative.length > 0 && (
        <p className="text-[10px] text-parchment/40">{t.turnOrder.dragHint}</p>
      )}
    </div>
  );
}
