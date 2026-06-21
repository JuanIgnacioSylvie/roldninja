import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { mkdirSync } from "node:fs";
import { env } from "../config/env.js";
import type { Container } from "../composition/container.js";
import { makeRequireAuth } from "./authMiddleware.js";
import { errorMessage, httpStatusForError } from "./errors.js";
import { registerAuthRoutes } from "./controllers/authController.js";
import { registerCampaignRoutes } from "./controllers/campaignController.js";
import { registerCharacterRoutes } from "./controllers/characterController.js";
import { registerBoardRoutes } from "./controllers/boardController.js";
import { registerMapRoutes } from "./controllers/mapController.js";

export async function buildHttpApp(container: Container) {
  const app = Fastify({ logger: env.nodeEnv === "development" });

  // Traduce errores de dominio a codigos HTTP.
  app.setErrorHandler((err, req, reply) => {
    const status = httpStatusForError(err);
    if (status === 500) req.log.error(err);
    reply.code(status).send({ message: errorMessage(err) });
  });

  await app.register(cors, { origin: env.webOrigin, credentials: true });
  await app.register(multipart, { limits: { fileSize: 25 * 1024 * 1024 } });

  mkdirSync(env.uploadDir, { recursive: true });
  await app.register(fastifyStatic, { root: env.uploadDir, prefix: "/uploads/" });

  app.get("/health", async () => ({ ok: true }));

  const { useCases } = container;

  // Rutas publicas
  registerAuthRoutes(app, useCases);

  // Rutas protegidas (scope con hook de autenticacion)
  const requireAuth = makeRequireAuth(container.tokenService);
  await app.register(async (scope) => {
    scope.addHook("preHandler", requireAuth);
    registerCampaignRoutes(scope, useCases);
    registerCharacterRoutes(scope, useCases);
    registerBoardRoutes(scope, useCases);
    registerMapRoutes(scope, useCases);
  });

  return app;
}
