"use client";
import { useCallback, useEffect, useState } from "react";
import type { BoardDTO, CampaignStateDTO, ChatMessageDTO } from "@roldninja/contracts";
import type { CharacterSheet, InitiativeEntry, TokenDraft } from "@roldninja/domain";
import { useRealtime } from "@/infrastructure/composition";
import { useAuth } from "@/infrastructure/state/authStore";

/** Hook de presentacion: orquesta la sesion sobre el puerto RealtimeGateway. */
export function useSession(campaignId: string) {
  const token = useAuth((s) => s.token);
  const realtime = useRealtime();

  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<CampaignStateDTO | null>(null);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [board, setBoard] = useState<BoardDTO | null>(null);
  const [initiativePrompt, setInitiativePrompt] = useState(false);
  const [characterUpdates, setCharacterUpdates] = useState<Record<string, CharacterSheet>>({});

  useEffect(() => {
    if (!token) return;
    realtime.connect(token);

    const join = () => {
      setConnected(true);
      realtime.join(campaignId);
    };

    const unsubscribe = realtime.subscribe({
      onConnect: join,
      onChatHistory: (msgs) => setMessages(msgs),
      onChatMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onStateUpdate: (s) => setState(s),
      onBoardUpdate: (b) => setBoard(b),
      onTokenMoved: ({ boardId, tokenId, x, y }) =>
        setBoard((prev) =>
          prev && prev.id === boardId
            ? { ...prev, tokens: prev.tokens.map((t) => (t.id === tokenId ? { ...t, x, y } : t)) }
            : prev,
        ),
      onInitiativePrompt: () => setInitiativePrompt(true),
      onCharacterUpdate: ({ characterId, sheet }) =>
        setCharacterUpdates((prev) => ({ ...prev, [characterId]: sheet })),
      onError: (message) => console.warn("[socket]", message),
    });

    if (realtime.isConnected()) join();

    return () => {
      realtime.leave(campaignId);
      unsubscribe();
    };
  }, [token, campaignId, realtime]);

  const sendChat = useCallback((content: string) => realtime.sendChat(campaignId, content), [realtime, campaignId]);
  const sendRoll = useCallback((notation: string, label?: string) => realtime.sendRoll(campaignId, notation, label), [realtime, campaignId]);
  const setMode = useCallback((mode: "FREE" | "COMBAT") => realtime.setMode(campaignId, mode), [realtime, campaignId]);
  const nextTurn = useCallback(() => realtime.nextTurn(campaignId), [realtime, campaignId]);

  const rollInitiative = useCallback((characterId: string, value?: number) => {
    realtime.rollInitiative(campaignId, characterId, value);
    setInitiativePrompt(false);
  }, [realtime, campaignId]);

  const cancelInitiative = useCallback((characterId: string) => {
    realtime.cancelInitiative(campaignId, characterId);
    setInitiativePrompt(false);
  }, [realtime, campaignId]);

  const reorderInitiative = useCallback((order: InitiativeEntry[]) => realtime.setInitiative(campaignId, order), [realtime, campaignId]);
  const moveToken = useCallback((boardId: string, tokenId: string, x: number, y: number) => realtime.moveToken(boardId, tokenId, x, y), [realtime]);
  const upsertToken = useCallback((boardId: string, token: TokenDraft) => realtime.upsertToken(boardId, token), [realtime]);
  const removeToken = useCallback((boardId: string, tokenId: string) => realtime.removeToken(boardId, tokenId), [realtime]);
  const patchSheet = useCallback((characterId: string, patch: Partial<CharacterSheet>) => realtime.patchSheet(campaignId, characterId, patch), [realtime, campaignId]);
  const setActiveBoard = useCallback((boardId: string | null) => realtime.setActiveBoard(campaignId, boardId), [realtime, campaignId]);

  return {
    connected,
    state,
    messages,
    board,
    setBoard,
    characterUpdates,
    initiativePrompt,
    setInitiativePrompt,
    sendChat,
    sendRoll,
    setMode,
    nextTurn,
    rollInitiative,
    cancelInitiative,
    reorderInitiative,
    moveToken,
    upsertToken,
    removeToken,
    patchSheet,
    setActiveBoard,
  };
}
