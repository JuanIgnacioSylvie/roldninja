import { createContainer } from "./composition/container.js";
import { buildHttpApp } from "./http/server.js";
import { createSocketServer } from "./realtime/socketServer.js";
import { env } from "./config/env.js";

async function main() {
  const container = createContainer();
  const app = await buildHttpApp(container);
  await app.ready();

  // Socket.IO se monta sobre el mismo servidor HTTP de Fastify.
  createSocketServer(app.server, container);

  await app.listen({ port: env.port, host: "0.0.0.0" });
  app.log.info(`Servidor escuchando en http://localhost:${env.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
