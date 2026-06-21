import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@roldninja/contracts";
import type { AuthenticatedUser } from "@roldninja/domain";
import type { Container } from "../composition/container.js";
import { errorMessage } from "../http/errors.js";
import { env } from "../config/env.js";

interface SocketData {
  user: AuthenticatedUser;
}

type IOServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

const room = (campaignId: string) => `campaign:${campaignId}`;

/**
 * Adaptador de entrada de tiempo real: traduce eventos de socket a casos de uso
 * y difunde los resultados. No contiene logica de negocio.
 */
export function createSocketServer(httpServer: HttpServer, container: Container): IOServer {
  const { tokenService, useCases: uc } = container;
  const io: IOServer = new Server(httpServer, {
    cors: { origin: env.webOrigin, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    const user = token ? tokenService.verify(token) : null;
    if (!user) return next(new Error("No autenticado"));
    socket.data.user = user;
    next();
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    const fail = (err: unknown) => socket.emit("error", { message: errorMessage(err) });

    socket.on("campaign:join", async (campaignId) => {
      try {
        const { history, state } = await uc.joinCampaign.execute(user.id, campaignId);
        await socket.join(room(campaignId));
        socket.emit("chat:history", history);
        socket.emit("state:update", state);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("campaign:leave", (campaignId) => {
      void socket.leave(room(campaignId));
    });

    socket.on("chat:send", async ({ campaignId, content }) => {
      try {
        const msg = await uc.sendChat.execute({ user, campaignId, content });
        if (msg) io.to(room(campaignId)).emit("chat:message", msg);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("chat:roll", async ({ campaignId, notation, label }) => {
      try {
        const msg = await uc.rollDice.execute({ user, campaignId, notation, label });
        io.to(room(campaignId)).emit("chat:message", msg);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("character:patchSheet", async ({ campaignId, characterId, patch }) => {
      try {
        const { sheet, affectedBoards } = await uc.patchSheet.execute({ user, campaignId, characterId, patch });
        for (const board of affectedBoards) io.to(room(campaignId)).emit("board:update", board);
        io.to(room(campaignId)).emit("character:update", { characterId, sheet });
      } catch (e) {
        fail(e);
      }
    });

    socket.on("state:setMode", async ({ campaignId, mode }) => {
      try {
        const { state, promptInitiative } = await uc.setMode.execute({ userId: user.id, campaignId, mode });
        io.to(room(campaignId)).emit("state:update", state);
        if (promptInitiative) io.to(room(campaignId)).emit("initiative:prompt", { campaignId });
      } catch (e) {
        fail(e);
      }
    });

    socket.on("state:setInitiative", async ({ campaignId, order }) => {
      try {
        const state = await uc.setInitiative.execute({ userId: user.id, campaignId, order });
        io.to(room(campaignId)).emit("state:update", state);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("state:nextTurn", async ({ campaignId }) => {
      try {
        const state = await uc.nextTurn.execute({ userId: user.id, campaignId });
        if (state) io.to(room(campaignId)).emit("state:update", state);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("state:setActiveBoard", async ({ campaignId, boardId }) => {
      try {
        const state = await uc.setActiveBoard.execute({ userId: user.id, campaignId, boardId });
        io.to(room(campaignId)).emit("state:update", state);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("initiative:roll", async ({ campaignId, characterId, value }) => {
      try {
        const state = await uc.rollInitiative.execute({ userId: user.id, campaignId, characterId, value });
        if (state) io.to(room(campaignId)).emit("state:update", state);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("initiative:cancel", async ({ campaignId, characterId }) => {
      try {
        const state = await uc.cancelInitiative.execute({ userId: user.id, campaignId, characterId });
        if (state) io.to(room(campaignId)).emit("state:update", state);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("token:move", async ({ boardId, tokenId, x, y }) => {
      try {
        const result = await uc.moveToken.execute({ userId: user.id, boardId, tokenId, x, y });
        if (result) io.to(room(result.campaignId)).emit("token:moved", { boardId, tokenId, x, y });
      } catch (e) {
        fail(e);
      }
    });

    socket.on("token:upsert", async ({ boardId, token }) => {
      try {
        const board = await uc.upsertToken.execute({ boardId, token });
        if (board) io.to(room(board.campaignId)).emit("board:update", board);
      } catch (e) {
        fail(e);
      }
    });

    socket.on("token:remove", async ({ boardId, tokenId }) => {
      try {
        const board = await uc.removeToken.execute({ boardId, tokenId });
        if (board) io.to(room(board.campaignId)).emit("board:update", board);
      } catch (e) {
        fail(e);
      }
    });
  });

  return io;
}
