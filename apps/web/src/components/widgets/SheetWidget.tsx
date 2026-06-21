"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, RotateCcw, Save, ZoomIn, ZoomOut } from "lucide-react";
import { mergeCharacterSheet, type CharacterSheet } from "@roldninja/domain";
import { useApi } from "@/infrastructure/composition";
import { CharacterSheetEditor } from "@/components/character-sheet/CharacterSheetEditor";
import { normalizeSheet, type SheetMeta } from "@/lib/character-sheet-utils";
import { useTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/** Ancho fijo de la hoja completa (3 columnas); no se comprime al redimensionar el widget. */
const SHEET_WIDTH = 1024;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

export function SheetWidget({
  characterId,
  campaignId,
  sheetOverride,
  editable = false,
  inCombat = false,
  isMyTurn = true,
  onRoll,
  onPatch,
}: {
  characterId: string | null;
  campaignId?: string;
  sheetOverride?: CharacterSheet;
  editable?: boolean;
  inCombat?: boolean;
  isMyTurn?: boolean;
  onRoll?: (notation: string, label?: string) => void;
  onPatch: (characterId: string, patch: Partial<CharacterSheet>) => void;
}) {
  const api = useApi();
  const t = useTranslation();
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [meta, setMeta] = useState<SheetMeta>({ name: "", species: "", class: "", background: "", level: 1 });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [innerHeight, setInnerHeight] = useState(900);
  const areaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const actionsEnabled = !inCombat || isMyTurn;

  useEffect(() => {
    if (!characterId) return;
    void api.getCharacter(characterId).then((c) => {
      setMeta({
        name: c.name ?? "",
        species: c.species ?? "",
        class: c.class ?? "",
        background: c.background ?? "",
        level: c.level ?? 1,
      });
      setSheet(normalizeSheet(c.sheet as Partial<CharacterSheet>));
      setDirty(false);
    });
  }, [characterId, api]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [sheet?.currentHp]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round((z + delta) * 100) / 100)));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [characterId]);

  const activeSheet = useMemo(() => {
    if (!sheet) return null;
    const merged = sheetOverride ? mergeCharacterSheet(sheet, sheetOverride) : sheet;
    return normalizeSheet(merged as Partial<CharacterSheet>);
  }, [sheet, sheetOverride]);

  function handleSheetChange(patch: Partial<CharacterSheet>) {
    setSheet((prev) => (prev ? normalizeSheet(mergeCharacterSheet(prev, patch) as Partial<CharacterSheet>) : prev));
    if (characterId) onPatch(characterId, patch);
    setDirty(true);
  }

  function handleMetaChange(patch: Partial<SheetMeta>) {
    setMeta((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  function zoomIn() {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
  }
  function zoomOut() {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
  }
  function zoomReset() {
    setZoom(1);
  }

  async function save() {
    if (!characterId || !sheet) return;
    setSaving(true);
    try {
      await api.updateCharacter(characterId, {
        name: meta.name,
        species: meta.species || null,
        class: meta.class || null,
        background: meta.background || null,
        level: meta.level,
        sheet,
      });
      onPatch(characterId, sheet);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  async function onPortraitUpload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      handleSheetChange({ portraitUrl: url });
    } finally {
      setUploading(false);
    }
  }

  if (!characterId) {
    return <Empty text="No controlás ningún personaje en esta partida." />;
  }
  if (!activeSheet) {
    return <Empty text="Cargando hoja..." />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-panel2/60 px-2 py-1">
        <div className="flex items-center gap-2">
          {campaignId && (
            <Link
              href={`/campaigns/${campaignId}/characters/${characterId}/sheet`}
              className="flex items-center gap-1 text-[11px] text-parchment/60 hover:text-gold"
            >
              <ExternalLink className="h-3 w-3" /> Hoja completa
            </Link>
          )}
          {inCombat && !actionsEnabled && (
            <span className="text-[10px] text-parchment/45">Esperá tu turno para actuar</span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="flex items-center gap-0.5 rounded border border-white/10 bg-surface2/80 p-0.5">
            <ZoomBtn onClick={zoomOut} title={t.board.zoomOut} disabled={zoom <= ZOOM_MIN}>
              <ZoomOut className="h-3 w-3" />
            </ZoomBtn>
            <button
              type="button"
              onClick={zoomReset}
              title={t.board.zoomReset}
              className="min-w-[2.5rem] rounded px-1 py-0.5 text-[10px] font-medium text-parchment/70 hover:bg-white/5"
            >
              {Math.round(zoom * 100)}%
            </button>
            <ZoomBtn onClick={zoomIn} title={t.board.zoomIn} disabled={zoom >= ZOOM_MAX}>
              <ZoomIn className="h-3 w-3" />
            </ZoomBtn>
            <ZoomBtn onClick={zoomReset} title={t.board.zoomReset} disabled={zoom === 1}>
              <RotateCcw className="h-3 w-3" />
            </ZoomBtn>
          </div>
          {editable && (
            <button
              onClick={() => void save()}
              disabled={saving || !dirty}
              className={cn(
                "flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold transition",
                dirty ? "bg-brand text-white hover:bg-brand-light" : "text-parchment/40",
              )}
            >
              <Save className="h-3 w-3" /> {saving ? "..." : dirty ? "Guardar" : "Guardado"}
            </button>
          )}
        </div>
      </div>
      <div
        ref={areaRef}
        className="min-h-0 flex-1 overflow-auto bg-[#262626] p-2"
        title="Ctrl + rueda del mouse para zoom"
      >
        <div
          className="relative mx-auto"
          style={{ width: SHEET_WIDTH * zoom, height: innerHeight * zoom }}
        >
          <div
            ref={innerRef}
            className="absolute left-0 top-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: SHEET_WIDTH }}
          >
            <CharacterSheetEditor
              sheet={activeSheet}
              meta={meta}
              readOnly={!editable}
              interactive={!!onRoll}
              actionsEnabled={actionsEnabled}
              onRoll={onRoll}
              uploading={uploading}
              onSheetChange={handleSheetChange}
              onMetaChange={handleMetaChange}
              onPortraitUpload={editable ? onPortraitUpload : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoomBtn({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="rounded p-1 text-parchment/60 hover:bg-white/5 hover:text-parchment disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="flex h-full items-center justify-center p-4 text-center text-sm text-parchment/50">{text}</div>;
}
