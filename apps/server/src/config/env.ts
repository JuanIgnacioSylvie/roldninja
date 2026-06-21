import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

// Carga el .env de la raíz del monorepo (apps/server/src/config -> ../../../../.env).
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../../../../.env") });

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  nodeEnv: process.env.NODE_ENV ?? "development",
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  uploadDir: join(process.cwd(), "uploads"),
};
