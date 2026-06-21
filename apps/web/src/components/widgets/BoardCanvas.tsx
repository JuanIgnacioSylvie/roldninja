"use client";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Line, Circle, Text, Group, Image as KonvaImage } from "react-konva";
import type Konva from "konva";
import type { BoardDTO, TokenDTO } from "@roldninja/contracts";
import { assetUrl } from "@/infrastructure/config";
import { hexToRgba } from "@/lib/utils";

const FEET_PER_CELL = 5;

interface ContextMenuState {
  x: number;
  y: number;
  token: TokenDTO;
}

function useHtmlImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const image = new window.Image();
    // crossOrigin rompe thumbnails de Google Drive y no hace falta en assets locales.
    if (src.startsWith("http") && !src.includes("google.com") && !src.includes("googleusercontent.com")) {
      image.crossOrigin = "anonymous";
    }
    image.onload = () => {
      if (image.naturalWidth > 0) setImg(image);
      else setImg(null);
    };
    image.onerror = () => setImg(null);
    image.src = src;
    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);
  return img;
}

export default function BoardCanvas({
  board,
  isDM,
  myCharacterId,
  selectedTokenId,
  measureMode,
  onMoveToken,
  onSelectToken,
  onAddToTurnOrder,
  onViewTokenImage,
  onDuplicateToken,
  onDeleteToken,
  turnOrderLabel,
  duplicateLabel,
  deleteLabel,
  zoom = 1,
}: {
  board: BoardDTO;
  isDM: boolean;
  myCharacterId?: string | null;
  selectedTokenId: string | null;
  measureMode: boolean;
  onMoveToken: (tokenId: string, x: number, y: number) => void;
  onSelectToken: (tokenId: string | null) => void;
  onAddToTurnOrder?: (token: TokenDTO) => void;
  onViewTokenImage?: (token: TokenDTO) => void;
  onDuplicateToken?: (token: TokenDTO) => void;
  onDeleteToken?: (tokenId: string) => void;
  turnOrderLabel?: string;
  duplicateLabel?: string;
  deleteLabel?: string;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isPanning, setIsPanning] = useState(false);
  const [measure, setMeasure] = useState<{ start: { cx: number; cy: number }; end: { cx: number; cy: number } } | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const bg = useHtmlImage(assetUrl(board.backgroundUrl));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!measureMode) setMeasure(null);
  }, [measureMode]);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    function onMouseUp() {
      if (!panRef.current) return;
      if (panRef.current.moved) suppressClickRef.current = true;
      panRef.current = null;
      setIsPanning(false);
    }
    function onMouseMove(e: MouseEvent) {
      if (!panRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const pan = panRef.current;
      const dx = e.clientX - pan.x;
      const dy = e.clientY - pan.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) pan.moved = true;
      el.scrollLeft = pan.scrollLeft - dx;
      el.scrollTop = pan.scrollTop - dy;
    }
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const fitCell = Math.max(22, Math.min(size.width / board.cols, size.height / board.rows));
  const cell = fitCell * zoom;
  const gridW = cell * board.cols;
  const gridH = cell * board.rows;
  const canvasW = Math.max(size.width, gridW);
  const canvasH = Math.max(size.height, gridH);
  const offsetX = (canvasW - gridW) / 2;
  const offsetY = (canvasH - gridH) / 2;

  const canPan = !measureMode && (canvasW > size.width || canvasH > size.height);

  function isBackgroundTarget(target: Konva.Node) {
    const stage = target.getStage();
    if (!stage) return false;
    return target === stage || target.name() === "bg";
  }

  function startPan(clientX: number, clientY: number) {
    const el = containerRef.current;
    if (!el) return;
    panRef.current = {
      x: clientX,
      y: clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
      moved: false,
    };
    setIsPanning(true);
  }

  function applyPan(clientX: number, clientY: number) {
    const pan = panRef.current;
    const el = containerRef.current;
    if (!pan || !el) return;
    const dx = clientX - pan.x;
    const dy = clientY - pan.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) pan.moved = true;
    el.scrollLeft = pan.scrollLeft - dx;
    el.scrollTop = pan.scrollTop - dy;
  }

  function cellFromPointer(stage: Konva.Stage | null): { cx: number; cy: number } | null {
    const pos = stage?.getRelativePointerPosition();
    if (!pos) return null;
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;
    if (x < 0 || y < 0 || x >= gridW || y >= gridH) return null;
    return { cx: Math.floor(x / cell), cy: Math.floor(y / cell) };
  }

  const visibleTokens = board.tokens.filter((t) => isDM || !t.hidden);

  function handleStageMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!canPan || e.evt.button !== 0) return;
    if (!isBackgroundTarget(e.target)) return;
    e.evt.preventDefault();
    startPan(e.evt.clientX, e.evt.clientY);
  }

  function handleStageClick(e: Konva.KonvaEventObject<MouseEvent>) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setContextMenu(null);
    if (measureMode) {
      const c = cellFromPointer(e.target.getStage());
      if (!c) return;
      if (!measure) setMeasure({ start: c, end: c });
      else setMeasure(null);
      return;
    }
    if (e.target === e.target.getStage() || e.target.name() === "bg") onSelectToken(null);
  }

  function handleMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (panRef.current) {
      applyPan(e.evt.clientX, e.evt.clientY);
      return;
    }
    if (measureMode && measure) {
      const c = cellFromPointer(e.target.getStage());
      if (c) setMeasure((m) => (m ? { ...m, end: c } : m));
    }
  }

  const distFeet = measure
    ? Math.max(Math.abs(measure.end.cx - measure.start.cx), Math.abs(measure.end.cy - measure.start.cy)) * FEET_PER_CELL
    : 0;

  const gridStroke = hexToRgba(board.gridColor ?? "#ffffff", board.gridOpacity ?? 0.08);
  const gridWidth = board.gridLineWidth ?? 1;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-auto bg-surface2/80 ${canPan ? (isPanning ? "cursor-grabbing select-none" : "cursor-grab") : ""}`}
    >
      <Stage
        width={canvasW}
        height={canvasH}
        draggable={false}
        onMouseDown={handleStageMouseDown}
        onClick={handleStageClick}
        onMouseMove={handleMouseMove}
      >
        <Layer x={offsetX} y={offsetY}>
          {bg ? (
            <KonvaImage image={bg} width={gridW} height={gridH} name="bg" />
          ) : (
            <Rect width={gridW} height={gridH} fill="#131517" name="bg" />
          )}

          {Array.from({ length: board.cols + 1 }).map((_, i) => (
            <Line key={`v${i}`} points={[i * cell, 0, i * cell, gridH]} stroke={gridStroke} strokeWidth={gridWidth} listening={false} />
          ))}
          {Array.from({ length: board.rows + 1 }).map((_, i) => (
            <Line key={`h${i}`} points={[0, i * cell, gridW, i * cell]} stroke={gridStroke} strokeWidth={gridWidth} listening={false} />
          ))}

          {visibleTokens.map((t) => {
            const canMove = isDM || (!!myCharacterId && t.characterId === myCharacterId);
            return (
            <TokenShape
              key={t.id}
              token={t}
              cell={cell}
              cols={board.cols}
              rows={board.rows}
              selected={t.id === selectedTokenId}
              draggable={!measureMode && canMove}
              onSelect={() => onSelectToken(t.id)}
              onMove={(x, y) => onMoveToken(t.id, x, y)}
              onContextMenu={(e) => {
                if (isDM && onAddToTurnOrder) {
                  e.evt.preventDefault();
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const el = containerRef.current;
                  setContextMenu({
                    x: e.evt.clientX - rect.left + (el?.scrollLeft ?? 0),
                    y: e.evt.clientY - rect.top + (el?.scrollTop ?? 0),
                    token: t,
                  });
                  return;
                }
                const foreign =
                  !isDM &&
                  t.imageUrl &&
                  t.characterId !== myCharacterId;
                if (foreign && onViewTokenImage) {
                  e.evt.preventDefault();
                  onViewTokenImage(t);
                }
              }}
            />
            );
          })}

          {measure && (
            <>
              <Line
                points={[
                  measure.start.cx * cell + cell / 2,
                  measure.start.cy * cell + cell / 2,
                  measure.end.cx * cell + cell / 2,
                  measure.end.cy * cell + cell / 2,
                ]}
                stroke="#853bce"
                strokeWidth={2}
                dash={[8, 4]}
                listening={false}
              />
              <Text
                x={measure.end.cx * cell + cell / 2 + 6}
                y={measure.end.cy * cell + cell / 2 - 18}
                text={`${distFeet} pies`}
                fontSize={14}
                fill="#fff"
                listening={false}
              />
            </>
          )}
        </Layer>
      </Stage>

      {contextMenu && (
        <div
          className="absolute z-50 min-w-[180px] rounded-md border border-white/15 bg-panel py-1 text-xs shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {onAddToTurnOrder && (
            <button
              className="w-full px-3 py-2 text-left text-parchment hover:bg-brand hover:text-white"
              onClick={() => {
                onAddToTurnOrder(contextMenu.token);
                setContextMenu(null);
              }}
            >
              {turnOrderLabel ?? "Agregar al orden de turno"}
            </button>
          )}
          {onDuplicateToken && (
            <button
              className="w-full px-3 py-2 text-left text-parchment hover:bg-brand hover:text-white"
              onClick={() => {
                onDuplicateToken(contextMenu.token);
                setContextMenu(null);
              }}
            >
              {duplicateLabel ?? "Duplicar"}
            </button>
          )}
          {onDeleteToken && (
            <button
              className="w-full px-3 py-2 text-left text-red-300 hover:bg-red-900/40"
              onClick={() => {
                onDeleteToken(contextMenu.token.id);
                setContextMenu(null);
              }}
            >
              {deleteLabel ?? "Eliminar"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function tokenCenterPx(cell: number, token: Pick<TokenDTO, "x" | "y" | "size">) {
  return {
    x: (token.x + token.size / 2) * cell,
    y: (token.y + token.size / 2) * cell,
  };
}

function tokenRadiusPx(cell: number, size: number) {
  return (cell * size / 2) * 0.85;
}

function TokenShape({
  token,
  cell,
  cols,
  rows,
  selected,
  draggable,
  onSelect,
  onMove,
  onContextMenu,
}: {
  token: TokenDTO;
  cell: number;
  cols: number;
  rows: number;
  selected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onContextMenu?: (e: Konva.KonvaEventObject<PointerEvent>) => void;
}) {
  const center = tokenCenterPx(cell, token);
  const radius = tokenRadiusPx(cell, token.size);
  const hasHp = token.maxHp != null && token.maxHp > 0;
  const hpRatio = hasHp ? Math.max(0, Math.min(1, (token.hp ?? 0) / token.maxHp!)) : 1;
  const barW = cell * 0.9 * token.size;
  const img = useHtmlImage(assetUrl(token.imageUrl ?? undefined));

  return (
    <Group
      x={center.x}
      y={center.y}
      draggable={draggable}
      opacity={token.hidden ? 0.45 : 1}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onContextMenu={onContextMenu}
      onDragStart={(e) => {
        e.cancelBubble = true;
      }}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;
        const group = e.target.getType() === "Group" ? e.target : e.target.getParent();
        if (!group) return;
        const half = token.size / 2;
        const nx = Math.max(0, Math.min(cols - token.size, Math.round(group.x() / cell - half)));
        const ny = Math.max(0, Math.min(rows - token.size, Math.round(group.y() / cell - half)));
        const snapped = tokenCenterPx(cell, { ...token, x: nx, y: ny });
        group.position(snapped);
        onMove(nx, ny);
      }}
    >
      {img ? (
        <>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={img}
              x={-radius}
              y={-radius}
              width={radius * 2}
              height={radius * 2}
              listening={false}
            />
          </Group>
          <Circle
            radius={radius}
            stroke={selected ? "#853bce" : "#000"}
            strokeWidth={selected ? 3 : 1}
            listening={false}
          />
        </>
      ) : (
        <Circle
          radius={radius}
          fill={token.color}
          stroke={selected ? "#853bce" : token.hidden ? "#fff" : "#000"}
          strokeWidth={selected ? 3 : 1}
          dash={token.hidden ? [4, 3] : undefined}
        />
      )}
      {!img && (
        <Text
          text={token.label.slice(0, 2)}
          fontSize={cell * 0.4}
          fill="#fff"
          align="center"
          verticalAlign="middle"
          width={cell}
          height={cell}
          offsetX={cell / 2}
          offsetY={cell / 2}
          listening={false}
        />
      )}
      {hasHp && (
        <>
          <Rect x={-barW / 2} y={radius + 2} width={barW} height={5} fill="#3f1d1d" cornerRadius={2} listening={false} />
          <Rect
            x={-barW / 2}
            y={radius + 2}
            width={barW * hpRatio}
            height={5}
            fill={hpRatio > 0.5 ? "#16a34a" : hpRatio > 0.25 ? "#ca8a04" : "#dc2626"}
            cornerRadius={2}
            listening={false}
          />
        </>
      )}
      {/* Área de hit para arrastrar/seleccionar (hijos visuales tienen listening=false). */}
      <Circle radius={radius} fill="rgba(0,0,0,0.001)" />
    </Group>
  );
}
