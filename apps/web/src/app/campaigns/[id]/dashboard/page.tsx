"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GripVertical, X, Plus, LayoutGrid } from "lucide-react";
import { CLASSES, type InitiativeEntry } from "@roldninja/domain";
import type { TokenDTO } from "@roldninja/contracts";
import { useApi } from "@/infrastructure/composition";
import { useAuth } from "@/infrastructure/state/authStore";
import { useSession } from "@/hooks/useSession";
import { AppShell } from "@/components/AppShell";
import { CampaignShell } from "@/components/CampaignShell";
import { Button, Card } from "@/components/ui";
import { ChatWidget } from "@/components/widgets/ChatWidget";
import { SheetWidget } from "@/components/widgets/SheetWidget";
import { BoardWidget } from "@/components/widgets/BoardWidget";
import { MonsterBankWidget, getMonsterTokenGridSize } from "@/components/widgets/MonsterBankWidget";
import { SpellsWidget, SpellCardWidget } from "@/components/widgets/SpellsWidget";
import { NotepadWidget } from "@/components/widgets/NotepadWidget";
import { TurnOrderWidget } from "@/components/widgets/TurnOrderWidget";
import { InitiativePrompt } from "@/components/InitiativePrompt";
import { useTranslation, useLocale } from "@/i18n/LocaleProvider";
import { spellName, type SrdSpell } from "@/lib/srd-i18n";

const ResponsiveGrid = WidthProvider(Responsive);

type WidgetId = string;

interface DashboardState {
  widgets: WidgetId[];
  layout: Layout[];
}

const WIDGET_DEFAULTS: Record<string, { w: number; h: number; minW?: number; minH?: number }> = {
  chat: { w: 3, h: 8, minW: 2, minH: 4 },
  board: { w: 8, h: 14, minW: 4, minH: 6 },
  sheet: { w: 3, h: 10, minW: 2, minH: 4 },
  monsterBank: { w: 3, h: 10, minW: 2, minH: 4 },
  spells: { w: 3, h: 8, minW: 2, minH: 4 },
  notepad: { w: 3, h: 6, minW: 2, minH: 3 },
  turnOrder: { w: 4, h: 8, minW: 3, minH: 5 },
};

function storageKey(campaignId: string, userId: string) {
  return `dashboard:${campaignId}:${userId}`;
}

function loadDashboard(campaignId: string, userId: string): DashboardState {
  try {
    const raw = localStorage.getItem(storageKey(campaignId, userId));
    if (raw) return JSON.parse(raw) as DashboardState;
  } catch { /* ignore */ }
  return { widgets: [], layout: [] };
}

function saveDashboard(campaignId: string, userId: string, state: DashboardState) {
  localStorage.setItem(storageKey(campaignId, userId), JSON.stringify(state));
}

function nextPosition(layout: Layout[]): { x: number; y: number } {
  if (layout.length === 0) return { x: 0, y: 0 };
  const maxY = Math.max(...layout.map((l) => l.y + l.h));
  return { x: 0, y: maxY };
}

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const myCharacterId = searchParams.get("character");
  const api = useApi();
  const user = useAuth((s) => s.user);
  const t = useTranslation();
  const { locale } = useLocale();

  const session = useSession(id);
  const { state, messages, board, setBoard } = session;

  const [isDM, setIsDM] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardState>({ widgets: [], layout: [] });
  const [showPicker, setShowPicker] = useState(false);
  const [characterClassId, setCharacterClassId] = useState<string | undefined>();
  const [spellCatalog, setSpellCatalog] = useState<SrdSpell[]>([]);

  useEffect(() => {
    fetch("/srd-spells.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SrdSpell[]) => setSpellCatalog(Array.isArray(data) ? data : []))
      .catch(() => setSpellCatalog([]));
  }, []);

  useEffect(() => {
    void api.getCampaign(id).then((c) => setIsDM(c.isDM));
  }, [id, api]);

  useEffect(() => {
    if (!user) return;
    setDashboard(loadDashboard(id, user.id));
  }, [id, user]);

  useEffect(() => {
    if (!myCharacterId) return;
    void api.getCharacter(myCharacterId).then((ch) => {
      const className = ch.class;
      const klass = CLASSES.find((c) => c.name === className);
      if (klass) setCharacterClassId(klass.id);
    });
  }, [myCharacterId, api]);

  function persist(next: DashboardState) {
    setDashboard(next);
    if (user) saveDashboard(id, user.id, next);
  }

  function onLayoutChange(next: Layout[]) {
    persist({ ...dashboard, layout: next });
  }

  function addWidget(widgetId: WidgetId) {
    if (dashboard.widgets.includes(widgetId)) return;
    const base = WIDGET_DEFAULTS[widgetId] ?? { w: 3, h: 5, minW: 2, minH: 3 };
    const pos = nextPosition(dashboard.layout);
    const newLayout: Layout = {
      i: widgetId,
      x: pos.x,
      y: pos.y,
      w: base.w,
      h: base.h,
      minW: base.minW,
      minH: base.minH,
    };
    persist({
      widgets: [...dashboard.widgets, widgetId],
      layout: [...dashboard.layout, newLayout],
    });
    setShowPicker(false);
  }

  function removeWidget(widgetId: WidgetId) {
    persist({
      widgets: dashboard.widgets.filter((w) => w !== widgetId),
      layout: dashboard.layout.filter((l) => l.i !== widgetId),
    });
  }

  function pinSpell(spellId: string) {
    const widgetId = `spell:${spellId}`;
    addWidget(widgetId);
  }

  const pinnedSpellIds = dashboard.widgets
    .filter((w) => w.startsWith("spell:"))
    .map((w) => w.replace("spell:", ""));

  useEffect(() => {
    const activeId = state?.activeBoardId;
    if (!activeId) {
      setBoard(null);
      return;
    }
    void api.listBoards(id).then((boards) => {
      setBoard(boards.find((b) => b.id === activeId) ?? null);
    });
  }, [state?.activeBoardId, id, setBoard, api]);

  const inCombat = state?.mode === "COMBAT";
  const currentEntry = inCombat && state ? state.initiative[state.turnIndex] : undefined;
  const isMyTurn = !!myCharacterId && currentEntry?.characterId === myCharacterId;

  const myPendingEntry = useMemo(
    () => state?.initiative.find((e) => e.characterId === myCharacterId && e.pending),
    [state, myCharacterId],
  );

  function addMonsterToBoard(m: Parameters<typeof getMonsterTokenGridSize>[0] & { hp: number }, label: string, imageUrl?: string | null) {
    if (!board) return;
    session.upsertToken(board.id, {
      label,
      color: "#dc2626",
      hp: m.hp,
      maxHp: m.hp,
      x: 0,
      y: 0,
      size: getMonsterTokenGridSize(m),
      imageUrl: imageUrl ?? null,
    });
  }

  function addTokenToTurnOrder(token: TokenDTO) {
    if (state?.mode !== "COMBAT") return;
    const exists = state.initiative.some(
      (e) => (token.characterId && e.characterId === token.characterId) || e.name === token.label,
    );
    if (exists) return;
    const order: InitiativeEntry[] = [
      ...(state?.initiative ?? []),
      {
        characterId: token.characterId,
        userId: null,
        name: token.label,
        initiative: 0,
        pending: false,
        imageUrl: token.imageUrl,
        color: token.color,
        kind: token.characterId ? "player" : "monster",
      },
    ];
    session.reorderInitiative(order);
  }

  const availableWidgets = [
    { id: "chat", label: t.dashboard.widgets.chat },
    { id: "board", label: t.dashboard.widgets.board },
    { id: isDM ? "monsterBank" : "sheet", label: isDM ? t.dashboard.widgets.monsterBank : t.dashboard.widgets.sheet },
    { id: "spells", label: t.dashboard.widgets.spells },
    { id: "notepad", label: t.dashboard.widgets.notepad },
    { id: "turnOrder", label: t.dashboard.widgets.turnOrder },
  ];

  function widgetTitle(widgetId: WidgetId): string {
    if (widgetId.startsWith("spell:")) {
      const spell = spellCatalog.find((s) => s.id === widgetId.replace("spell:", ""));
      return spell ? spellName(spell, locale) : widgetId.replace("spell:", "");
    }
    const map: Record<string, string> = {
      chat: t.dashboard.widgets.chat,
      board: t.dashboard.widgets.board,
      sheet: t.dashboard.widgets.sheet,
      monsterBank: t.dashboard.widgets.monsterBank,
      spells: t.dashboard.widgets.spells,
      notepad: t.dashboard.widgets.notepad,
      turnOrder: t.dashboard.widgets.turnOrder,
    };
    return map[widgetId] ?? widgetId;
  }

  function renderWidget(widgetId: WidgetId) {
    if (widgetId.startsWith("spell:")) {
      return <SpellCardWidget spellId={widgetId.replace("spell:", "")} />;
    }
    switch (widgetId) {
      case "chat":
        return <ChatWidget messages={messages} onSend={session.sendChat} onRoll={session.sendRoll} />;
      case "board":
        return (
          <BoardWidget
            board={board}
            isDM={isDM}
            myCharacterId={myCharacterId}
            campaignId={id}
            onMove={(tokenId, x, y) => board && session.moveToken(board.id, tokenId, x, y)}
            onUpsertToken={(boardId, token) => session.upsertToken(boardId, token)}
            onRemoveToken={(boardId, tokenId) => session.removeToken(boardId, tokenId)}
            onActivate={(boardId) => session.setActiveBoard(boardId)}
            onAddToTurnOrder={addTokenToTurnOrder}
            onBoardChanged={() =>
              api.listBoards(id).then((bs) =>
                setBoard(bs.find((b) => b.id === state?.activeBoardId) ?? null),
              )
            }
          />
        );
      case "sheet":
        return (
          <SheetWidget
            characterId={myCharacterId}
            campaignId={id}
            inCombat={inCombat}
            isMyTurn={isMyTurn}
            sheetOverride={myCharacterId ? session.characterUpdates[myCharacterId] : undefined}
            onRoll={session.sendRoll}
            onPatch={session.patchSheet}
          />
        );
      case "monsterBank":
        return (
          <MonsterBankWidget
            hasBoard={!!board}
            onAddToBoard={addMonsterToBoard}
          />
        );
      case "spells":
        return (
          <SpellsWidget
            classId={characterClassId}
            pinnedSpellIds={pinnedSpellIds}
            onPinSpell={pinSpell}
          />
        );
      case "notepad":
        return <NotepadWidget storageKey={`notepad:${id}:${user?.id}`} />;
      case "turnOrder":
        return (
          <TurnOrderWidget
            state={state}
            isDM={isDM}
            isMyTurn={isMyTurn}
            currentTurnIndex={state?.turnIndex ?? 0}
            onSetMode={session.setMode}
            onNextTurn={session.nextTurn}
            onReorder={session.reorderInitiative}
            onSort={() => {
              if (state) {
                session.reorderInitiative([...state.initiative].sort((a, b) => b.initiative - a.initiative));
              }
            }}
          />
        );
      default:
        return null;
    }
  }

  return (
    <AppShell>
      <CampaignShell characterId={myCharacterId}>
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <Button variant="gold" size="sm" onClick={() => setShowPicker((v) => !v)}>
            <Plus className="mr-1 inline h-3 w-3" /> {t.dashboard.addWidget}
          </Button>
          {showPicker && (
            <div className="flex flex-wrap gap-1">
              {availableWidgets.map((w) => (
                <Button
                  key={w.id}
                  size="sm"
                  variant="ghost"
                  disabled={dashboard.widgets.includes(w.id)}
                  onClick={() => addWidget(w.id)}
                >
                  {w.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {dashboard.widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-parchment/50">
            <LayoutGrid className="h-12 w-12 opacity-30" />
            <p className="text-center text-sm">{t.dashboard.empty}</p>
            <Button variant="gold" onClick={() => setShowPicker(true)}>
              <Plus className="mr-1 inline h-4 w-4" /> {t.dashboard.addWidget}
            </Button>
          </div>
        ) : (
          <ResponsiveGrid
            className="p-2"
            layouts={{ lg: dashboard.layout, md: dashboard.layout, sm: dashboard.layout, xs: dashboard.layout, xxs: dashboard.layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={44}
            draggableHandle=".drag-handle"
            onLayoutChange={onLayoutChange}
          >
            {dashboard.widgets.map((widgetId) => (
              <div key={widgetId}>
                <WidgetFrame
                  title={widgetTitle(widgetId)}
                  onRemove={() => removeWidget(widgetId)}
                >
                  {renderWidget(widgetId)}
                </WidgetFrame>
              </div>
            ))}
          </ResponsiveGrid>
        )}

        <InitiativePrompt
          open={session.initiativePrompt && !!myPendingEntry && !isDM}
          characterName={myPendingEntry?.name ?? "Tu personaje"}
          onRoll={() => myCharacterId && session.rollInitiative(myCharacterId)}
          onCancel={() => myCharacterId && session.cancelInitiative(myCharacterId)}
        />
      </CampaignShell>
    </AppShell>
  );
}

function WidgetFrame({
  title,
  children,
  onRemove,
}: {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  const t = useTranslation();
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="drag-handle flex cursor-move items-center gap-1 border-b border-white/[0.06] bg-surface2/80 px-2 py-1.5">
        <GripVertical className="h-4 w-4 text-muted" />
        <span className="flex-1 text-xs font-medium uppercase tracking-wide text-muted">{title}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="-m-1 rounded p-2 text-parchment/40 transition hover:bg-red-900/30 hover:text-red-400"
            aria-label={t.common.close}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </Card>
  );
}

