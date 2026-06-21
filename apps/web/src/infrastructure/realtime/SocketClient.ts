"use client";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@roldninja/contracts";
import type { CharacterSheet, InitiativeEntry, TokenDraft } from "@roldninja/domain";
import type { RealtimeGateway, RealtimeHandlers } from "@/application/ports/RealtimeGateway";
import { SERVER_URL } from "@/infrastructure/config";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/** Implementacion Socket.IO del puerto RealtimeGateway. */
export class SocketClient implements RealtimeGateway {
  private socket: AppSocket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) return;
    this.socket = io(SERVER_URL, { auth: { token }, autoConnect: true, transports: ["websocket"] });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  subscribe(handlers: Partial<RealtimeHandlers>): () => void {
    const s = this.socket;
    if (!s) return () => {};

    const bindings: Array<[keyof ServerToClientEvents | "connect", (...args: never[]) => void]> = [];
    const on = <K extends keyof ServerToClientEvents>(event: K, fn: ServerToClientEvents[K]) => {
      s.on(event, fn as never);
      bindings.push([event, fn as never]);
    };

    if (handlers.onConnect) {
      s.on("connect", handlers.onConnect);
      bindings.push(["connect", handlers.onConnect]);
    }
    if (handlers.onChatHistory) on("chat:history", handlers.onChatHistory);
    if (handlers.onChatMessage) on("chat:message", handlers.onChatMessage);
    if (handlers.onStateUpdate) on("state:update", handlers.onStateUpdate);
    if (handlers.onBoardUpdate) on("board:update", handlers.onBoardUpdate);
    if (handlers.onTokenMoved) on("token:moved", handlers.onTokenMoved);
    if (handlers.onInitiativePrompt) on("initiative:prompt", () => handlers.onInitiativePrompt!());
    if (handlers.onCharacterUpdate) on("character:update", handlers.onCharacterUpdate);
    if (handlers.onError) on("error", (e) => handlers.onError!(e.message));

    return () => {
      for (const [event, fn] of bindings) s.off(event as never, fn as never);
    };
  }

  join(campaignId: string): void {
    this.socket?.emit("campaign:join", campaignId);
  }
  leave(campaignId: string): void {
    this.socket?.emit("campaign:leave", campaignId);
  }
  sendChat(campaignId: string, content: string): void {
    this.socket?.emit("chat:send", { campaignId, content });
  }
  sendRoll(campaignId: string, notation: string, label?: string): void {
    this.socket?.emit("chat:roll", { campaignId, notation, label });
  }
  setMode(campaignId: string, mode: "FREE" | "COMBAT"): void {
    this.socket?.emit("state:setMode", { campaignId, mode });
  }
  nextTurn(campaignId: string): void {
    this.socket?.emit("state:nextTurn", { campaignId });
  }
  setInitiative(campaignId: string, order: InitiativeEntry[]): void {
    this.socket?.emit("state:setInitiative", { campaignId, order });
  }
  rollInitiative(campaignId: string, characterId: string, value?: number): void {
    this.socket?.emit("initiative:roll", { campaignId, characterId, value });
  }
  cancelInitiative(campaignId: string, characterId: string): void {
    this.socket?.emit("initiative:cancel", { campaignId, characterId });
  }
  setActiveBoard(campaignId: string, boardId: string | null): void {
    this.socket?.emit("state:setActiveBoard", { campaignId, boardId });
  }
  moveToken(boardId: string, tokenId: string, x: number, y: number): void {
    this.socket?.emit("token:move", { boardId, tokenId, x, y });
  }
  upsertToken(boardId: string, token: TokenDraft): void {
    this.socket?.emit("token:upsert", { boardId, token });
  }
  removeToken(boardId: string, tokenId: string): void {
    this.socket?.emit("token:remove", { boardId, tokenId });
  }
  patchSheet(campaignId: string, characterId: string, patch: Partial<CharacterSheet>): void {
    this.socket?.emit("character:patchSheet", { campaignId, characterId, patch });
  }
}
