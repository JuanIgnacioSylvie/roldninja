import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ValidationError } from "@roldninja/domain";
import type { UseCases } from "../../composition/container.js";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

/** Rutas publicas de autenticacion. */
export function registerAuthRoutes(app: FastifyInstance, uc: UseCases) {
  app.post("/auth/login", async (req) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError();
    return uc.login.execute(parsed.data);
  });
}
