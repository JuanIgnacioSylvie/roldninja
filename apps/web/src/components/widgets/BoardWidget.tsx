"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Image as ImageIcon, Grid3x3, Ruler, Trash2, Eye, EyeOff, UserPlus, X, Settings2, ZoomIn, ZoomOut, RotateCcw, Copy } from "lucide-react";
import type { BoardDTO, TokenDTO } from "@roldninja/contracts";
import { useApi } from "@/infrastructure/composition";
import { assetUrl } from "@/infrastructure/config";
import { useTranslation } from "@/i18n/LocaleProvider";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { TokenImageModal } from "./TokenImageModal";

const BoardCanvas = dynamic(() => import("./BoardCanvas"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-parchment/50">Cargando tablero...</div>,
});

interface CharacterItem {
  id: string;
  name: string;
  isComplete: boolean;
}

export function BoardWidget({
  board,
  isDM,
  myCharacterId,
  campaignId,
  onMove,
  onUpsertToken,
  onRemoveToken,
  onActivate,
  onBoardChanged,
  onAddToTurnOrder,
}: {
  board: BoardDTO | null;
  isDM: boolean;
  myCharacterId?: string | null;
  campaignId: string;
  onMove: (tokenId: string, x: number, y: number) => void;
  onUpsertToken: (boardId: string, token: Partial<TokenDTO> & { id?: string }) => void;
  onRemoveToken: (boardId: string, tokenId: string) => void;
  onActivate: (boardId: string | null) => void;
  onBoardChanged: () => void;
  onAddToTurnOrder?: (token: TokenDTO) => void;
}) {
  const api = useApi();
  const t = useTranslation();
  const [boards, setBoards] = useState<BoardDTO[]>([]);
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [name, setName] = useState("Tablero");
  const [boardName, setBoardName] = useState("");
  const [cols, setCols] = useState(20);
  const [rows, setRows] = useState(20);
  const [gridColor, setGridColor] = useState("#ffffff");
  const [gridOpacity, setGridOpacity] = useState(0.08);
  const [gridLineWidth, setGridLineWidth] = useState(1);
  const [measureMode, setMeasureMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewToken, setPreviewToken] = useState<TokenDTO | null>(null);
  const [zoom, setZoom] = useState(1);
  const boardAreaRef = useRef<HTMLDivElement>(null);

  const ZOOM_MIN = 0.75;
  const ZOOM_MAX = 3;
  const ZOOM_STEP = 0.25;

  useEffect(() => {
    const el = boardAreaRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round((z + delta) * 100) / 100)));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [board?.id]);

  function zoomIn() {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
  }
  function zoomOut() {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
  }
  function zoomReset() {
    setZoom(1);
  }

  async function loadBoards() {
    setBoards(await api.listBoards(campaignId));
  }
  useEffect(() => {
    if (isDM) {
      void loadBoards();
      void api.listCharacters(campaignId).then((cs) => setCharacters(cs.filter((c) => c.isComplete)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDM, campaignId]);

  useEffect(() => {
    if (board) {
      setCols(board.cols);
      setRows(board.rows);
      setBoardName(board.name);
      setGridColor(board.gridColor ?? "#ffffff");
      setGridOpacity(board.gridOpacity ?? 0.08);
      setGridLineWidth(board.gridLineWidth ?? 1);
    }
  }, [board?.id, board?.cols, board?.rows, board?.name, board?.gridColor, board?.gridOpacity, board?.gridLineWidth]);

  const selected = board?.tokens.find((tok) => tok.id === selectedId) ?? null;

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();
    const b = await api.createBoard({ campaignId, name, cols, rows });
    setShowNew(false);
    await loadBoards();
    onActivate(b.id);
  }

  async function deleteBoard() {
    if (!board) return;
    if (!window.confirm(t.board.confirmDelete)) return;
    try {
      await api.deleteBoard(board.id);
      await loadBoards();
      onActivate(null);
      onBoardChanged();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : t.board.deleteFailed);
    }
  }

  async function applyBoardSettings() {
    if (!board) return;
    try {
      await api.updateBoard(board.id, {
        name: boardName.trim() || board.name,
        cols,
        rows,
        gridColor,
        gridOpacity: Math.max(0, Math.min(1, gridOpacity)),
        gridLineWidth: Math.max(0.5, Math.min(8, gridLineWidth || 1)),
      });
      await loadBoards();
      onBoardChanged();
      setShowSettings(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : t.board.saveFailed);
    }
  }

  async function removeBackground() {
    if (!board) return;
    await api.updateBoard(board.id, { backgroundUrl: null });
    onBoardChanged();
  }

  async function uploadTokenImage(file: File) {
    if (!board || !selected) return;
    const { url } = await api.uploadFile(file);
    onUpsertToken(board.id, { id: selected.id, ...stripToken(selected), imageUrl: url });
  }

  function duplicateToken(token: TokenDTO) {
    if (!board) return;
    onUpsertToken(board.id, {
      label: `${token.label} (2)`,
      x: Math.min(cols - 1, token.x + 1),
      y: token.y,
      color: token.color,
      size: token.size,
      hidden: token.hidden,
      hp: token.hp,
      maxHp: token.maxHp,
      imageUrl: token.imageUrl,
      characterId: null,
    });
  }

  async function uploadBackground(file: File) {
    if (!board) return;
    const { url } = await api.uploadFile(file);
    await api.updateBoard(board.id, { backgroundUrl: url });
    onBoardChanged();
  }

  function placeCharacter(ch: CharacterItem) {
    if (!board) return;
    void api.getCharacter(ch.id).then((full) => {
      onUpsertToken(board.id, {
        label: ch.name,
        characterId: ch.id,
        color: "#2563eb",
        imageUrl: full.sheet?.portraitUrl ?? null,
        x: 0,
        y: 0,
      });
      setShowPalette(false);
    });
  }

  if (!board) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-parchment/50">
        <Grid3x3 className="h-8 w-8" />
        <p>{isDM ? "No hay tablero activo." : "El DM todavía no activó un tablero."}</p>
        {isDM && (
          <>
            {boards.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1">
                {boards.map((b) => (
                  <Button key={b.id} size="sm" variant="ghost" onClick={() => onActivate(b.id)}>
                    {b.name} ({b.cols}×{b.rows})
                  </Button>
                ))}
              </div>
            )}
            <Button size="sm" variant="gold" onClick={() => setShowNew((v) => !v)}>
              <Plus className="mr-1 inline h-4 w-4" /> {t.board.newBoard}
            </Button>
            {showNew && (
              <form onSubmit={createBoard} className="mt-2 space-y-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.board.name} />
                <div className="flex gap-2">
                  <Input type="number" value={cols} onChange={(e) => setCols(+e.target.value)} min={1} max={100} />
                  <span className="self-center">×</span>
                  <Input type="number" value={rows} onChange={(e) => setRows(+e.target.value)} min={1} max={100} />
                </div>
                <Button type="submit" variant="gold" size="sm" className="w-full">{t.board.createAndActivate}</Button>
              </form>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.06] bg-surface2/40 p-1.5 text-xs">
        {isDM && (
          <>
            <select
              value={board.id}
              onChange={(e) => onActivate(e.target.value)}
              className="rounded bg-panel2 px-1 py-1 text-xs"
              title={t.board.switchBoard}
            >
              {boards.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.cols}×{b.rows})</option>
              ))}
            </select>
            <ToolBtn active={showSettings} onClick={() => setShowSettings((v) => !v)} title={t.board.settings}>
              <Settings2 className="h-3 w-3" /> {t.board.settings}
            </ToolBtn>
            <ToolBtn onClick={() => setShowNew((v) => !v)} title={t.board.newBoard}>
              <Plus className="h-3 w-3" /> {t.board.newBoard}
            </ToolBtn>
            <ToolBtn onClick={() => void deleteBoard()} title={t.board.deleteBoard}>
              <Trash2 className="h-3 w-3" /> {t.board.deleteBoard}
            </ToolBtn>
          </>
        )}
        {!isDM && <span className="mr-1 text-parchment/50">{board.name} · {board.cols}×{board.rows}</span>}
        <ToolBtn active={measureMode} onClick={() => setMeasureMode((v) => !v)} title="Medir distancia (5 pies/casilla)">
          <Ruler className="h-3 w-3" /> Medir
        </ToolBtn>
        <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-white/10 bg-surface2/80 p-0.5">
          <ToolBtn onClick={zoomOut} title={t.board.zoomOut} disabled={zoom <= ZOOM_MIN}>
            <ZoomOut className="h-3 w-3" />
          </ToolBtn>
          <button
            type="button"
            onClick={zoomReset}
            title={t.board.zoomReset}
            className="min-w-[3rem] rounded px-1.5 py-1 text-[10px] font-medium text-muted hover:bg-white/5 hover:text-parchment"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolBtn onClick={zoomIn} title={t.board.zoomIn} disabled={zoom >= ZOOM_MAX}>
            <ZoomIn className="h-3 w-3" />
          </ToolBtn>
          <ToolBtn onClick={zoomReset} title={t.board.zoomReset} disabled={zoom === 1}>
            <RotateCcw className="h-3 w-3" />
          </ToolBtn>
        </div>
        {isDM && (
          <>
            <label className="flex cursor-pointer items-center gap-1 rounded bg-panel2 px-2 py-1 hover:bg-arcane">
              <ImageIcon className="h-3 w-3" /> Fondo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadBackground(e.target.files[0])} />
            </label>
            <ToolBtn onClick={() => onUpsertToken(board.id, { label: "NPC", color: "#16a34a", x: 0, y: 0 })} title="Agregar NPC">
              <Plus className="h-3 w-3" /> NPC
            </ToolBtn>
            <ToolBtn active={showPalette} onClick={() => setShowPalette((v) => !v)} title="Colocar personaje">
              <UserPlus className="h-3 w-3" /> Personaje
            </ToolBtn>
          </>
        )}
      </div>

      {isDM && showSettings && board && (
        <div className="flex flex-wrap items-end gap-3 border-b border-white/10 bg-panel2/40 p-3 text-xs">
          <label className="flex min-w-[140px] flex-1 flex-col gap-1">
            {t.board.name}
            <Input className="py-1 text-xs" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            {t.board.cols}
            <Input className="w-16 py-1 text-xs" type="number" min={1} max={100} value={cols} onChange={(e) => setCols(+e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            {t.board.rows}
            <Input className="w-16 py-1 text-xs" type="number" min={1} max={100} value={rows} onChange={(e) => setRows(+e.target.value)} />
          </label>
          <div className="flex flex-col gap-1">
            {t.board.background}
            <div className="flex flex-wrap gap-1">
              <label className="flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-surface2 px-2 py-1 hover:bg-white/10">
                <ImageIcon className="h-3 w-3" /> {t.board.uploadImage}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadBackground(e.target.files[0])} />
              </label>
              {board.backgroundUrl && (
                <Button size="sm" variant="ghost" onClick={() => void removeBackground()}>
                  {t.board.removeBackground}
                </Button>
              )}
            </div>
          </div>
          <label className="flex flex-col gap-1">
            {t.board.gridColor}
            <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="h-8 w-14 cursor-pointer rounded border border-white/10 bg-surface2" />
          </label>
          <label className="flex flex-col gap-1">
            {t.board.gridOpacity} ({Math.round(gridOpacity * 100)}%)
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(gridOpacity * 100)}
              onChange={(e) => setGridOpacity(+e.target.value / 100)}
              className="w-28"
            />
          </label>
          <label className="flex flex-col gap-1">
            {t.board.gridLineWidth}
            <Input
              className="w-20 py-1 text-xs"
              type="number"
              min={0.5}
              max={8}
              step={0.5}
              value={gridLineWidth}
              onChange={(e) => setGridLineWidth(+e.target.value)}
            />
          </label>
          <Button size="sm" variant="gold" onClick={() => void applyBoardSettings()}>
            {t.board.saveSettings}
          </Button>
        </div>
      )}

      {isDM && showNew && (
        <form onSubmit={createBoard} className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-panel2/40 p-2 text-xs">
          <Input className="w-32 py-1 text-xs" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.board.name} />
          <Input className="w-14 py-1 text-xs" type="number" value={cols} onChange={(e) => setCols(+e.target.value)} min={1} max={100} />
          <span>×</span>
          <Input className="w-14 py-1 text-xs" type="number" value={rows} onChange={(e) => setRows(+e.target.value)} min={1} max={100} />
          <Button size="sm" variant="gold" type="submit">{t.board.createAndActivate}</Button>
        </form>
      )}

      {isDM && showPalette && (
        <div className="flex flex-wrap gap-1 border-b border-white/10 bg-panel2/40 p-1.5">
          {characters.length === 0 ? (
            <span className="text-xs text-parchment/50">No hay personajes completos para colocar.</span>
          ) : (
            characters.map((ch) => (
              <button key={ch.id} onClick={() => placeCharacter(ch)} className="rounded bg-panel2 px-2 py-1 text-xs hover:bg-arcane hover:text-white">
                + {ch.name}
              </button>
            ))
          )}
        </div>
      )}

      <div ref={boardAreaRef} className="relative min-h-0 flex-1" title="Ctrl + rueda del mouse para zoom">
        <BoardCanvas
          board={board}
          isDM={isDM}
          myCharacterId={myCharacterId}
          selectedTokenId={selectedId}
          measureMode={measureMode}
          onMoveToken={onMove}
          onSelectToken={setSelectedId}
          onAddToTurnOrder={isDM ? onAddToTurnOrder : undefined}
          onDuplicateToken={isDM ? duplicateToken : undefined}
          onDeleteToken={isDM ? (tokenId) => onRemoveToken(board.id, tokenId) : undefined}
          onViewTokenImage={(token) => setPreviewToken(token)}
          turnOrderLabel={t.board.addToTurnOrder}
          duplicateLabel={t.board.duplicateToken}
          deleteLabel={t.board.deleteToken}
          zoom={zoom}
        />

        {previewToken?.imageUrl && (
          <TokenImageModal
            open
            title={previewToken.label}
            imageUrl={previewToken.imageUrl}
            onClose={() => setPreviewToken(null)}
          />
        )}

        {isDM && selected && board && (
          <TokenInspector
            token={selected}
            cols={board.cols}
            rows={board.rows}
            onClose={() => setSelectedId(null)}
            onChange={(patch) => onUpsertToken(board.id, { id: selected.id, ...stripToken(selected), ...patch })}
            onDelete={() => {
              onRemoveToken(board.id, selected.id);
              setSelectedId(null);
            }}
            onDuplicate={() => duplicateToken(selected)}
            onUploadImage={(file) => void uploadTokenImage(file)}
            onRemoveImage={() => onUpsertToken(board.id, { id: selected.id, ...stripToken(selected), imageUrl: null })}
          />
        )}
      </div>
    </div>
  );
}

function stripToken(t: TokenDTO): Partial<TokenDTO> {
  return { label: t.label, x: t.x, y: t.y, color: t.color, size: t.size, hidden: t.hidden, hp: t.hp, maxHp: t.maxHp, characterId: t.characterId, imageUrl: t.imageUrl };
}

function TokenInspector({
  token,
  cols,
  rows,
  onClose,
  onChange,
  onDelete,
  onDuplicate,
  onUploadImage,
  onRemoveImage,
}: {
  token: TokenDTO;
  cols: number;
  rows: number;
  onClose: () => void;
  onChange: (patch: Partial<TokenDTO>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUploadImage: (file: File) => void;
  onRemoveImage: () => void;
}) {
  const t = useTranslation();

  return (
    <div className="absolute right-2 top-2 z-10 max-h-[calc(100%-1rem)] w-56 overflow-y-auto rounded-xl border border-white/[0.08] bg-surface/95 p-3 text-xs shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-white">{t.board.token}</span>
        <button onClick={onClose} className="-m-1 rounded p-2 hover:bg-white/10" aria-label={t.common.close}>
          <X className="h-3 w-3 text-parchment/60" />
        </button>
      </div>

      {token.imageUrl && (
        <div className="mb-2 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(token.imageUrl)} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10" />
        </div>
      )}

      <label className="mb-1 block text-parchment/60">{t.board.tokenName}</label>
      <Input
        className="mb-2 py-1 text-xs"
        value={token.label}
        onChange={(e) => onChange({ label: e.target.value })}
      />

      <label className="mb-1 block text-parchment/60">{t.board.tokenPosition}</label>
      <div className="mb-2 flex items-center gap-1">
        <Input
          className="py-1 text-xs"
          type="number"
          min={0}
          max={cols - 1}
          value={token.x}
          onChange={(e) => onChange({ x: Math.max(0, Math.min(cols - 1, +e.target.value || 0)) })}
        />
        <span>/</span>
        <Input
          className="py-1 text-xs"
          type="number"
          min={0}
          max={rows - 1}
          value={token.y}
          onChange={(e) => onChange({ y: Math.max(0, Math.min(rows - 1, +e.target.value || 0)) })}
        />
      </div>

      <div className="mb-2 flex items-center gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-parchment/60">{t.board.tokenColor}</label>
          <input type="color" value={token.color} onChange={(e) => onChange({ color: e.target.value })} className="h-7 w-full rounded bg-panel2" />
        </div>
        <div className="w-16">
          <label className="mb-1 block text-parchment/60">{t.board.tokenSize}</label>
          <Input className="py-1 text-xs" type="number" min={0.5} max={4} step={0.5} value={token.size} onChange={(e) => onChange({ size: +e.target.value })} />
        </div>
      </div>

      <label className="mb-1 block text-parchment/60">{t.board.tokenHp}</label>
      <div className="mb-2 flex items-center gap-1">
        <Input className="py-1 text-xs" type="number" value={token.hp ?? ""} onChange={(e) => onChange({ hp: e.target.value ? +e.target.value : null })} />
        <span>/</span>
        <Input className="py-1 text-xs" type="number" value={token.maxHp ?? ""} onChange={(e) => onChange({ maxHp: e.target.value ? +e.target.value : null })} />
      </div>

      <label className="mb-1 block text-parchment/60">{t.board.tokenImage}</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <label className="flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-surface2 px-2 py-1 hover:bg-white/10">
          <ImageIcon className="h-3 w-3" /> {t.board.uploadImage}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUploadImage(e.target.files[0])} />
        </label>
        {token.imageUrl && (
          <button type="button" onClick={onRemoveImage} className="rounded-md border border-white/10 bg-surface2 px-2 py-1 hover:bg-white/10">
            {t.board.removeImage}
          </button>
        )}
      </div>

      <button
        onClick={() => onChange({ hidden: !token.hidden })}
        className={cn("mb-2 flex w-full items-center justify-center gap-1 rounded px-2 py-1", token.hidden ? "bg-brand text-white" : "bg-panel2 text-parchment/70")}
      >
        {token.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        {token.hidden ? t.board.tokenHidden : t.board.tokenVisible}
      </button>

      <Button variant="ghost" size="sm" className="mb-2 w-full" onClick={onDuplicate}>
        <Copy className="mr-1 inline h-3 w-3" /> {t.board.duplicateToken}
      </Button>

      <Button variant="danger" size="sm" className="w-full" onClick={onDelete}>
        <Trash2 className="mr-1 inline h-3 w-3" /> {t.board.deleteToken}
      </Button>
    </div>
  );
}

function ToolBtn({
  active, onClick, title, disabled, children,
}: {
  active?: boolean; onClick: () => void; title?: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 rounded-md px-2 py-1 transition disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-brand text-white" : "bg-surface2 text-muted hover:bg-white/10 hover:text-parchment",
      )}
    >
      {children}
    </button>
  );
}
