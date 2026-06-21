import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthenticatedUser } from "@roldninja/domain";
import type { TokenService } from "@roldninja/application";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

/** Crea el preHandler de autenticacion a partir del TokenService inyectado. */
export function makeRequireAuth(tokens: TokenService) {
  return async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    const user = token ? tokens.verify(token) : null;
    if (!user) {
      return reply.code(401).send({ message: "No autenticado" });
    }
    req.user = user;
  };
}
