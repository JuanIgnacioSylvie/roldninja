import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ValidationError } from "@roldninja/domain";
import type { UseCases } from "../../composition/container.js";

const createSchema = z.object({
  campaignId: z.string(),
  name: z.string().min(1).default("Nuevo personaje"),
});

const updateSchema = z.object({
  name: z.string().optional(),
  species: z.string().nullable().optional(),
  class: z.string().nullable().optional(),
  background: z.string().nullable().optional(),
  level: z.number().int().min(1).max(20).optional(),
  // La forma de la hoja la valida el dominio (mergeCharacterSheet); aqui se acepta como objeto.
  sheet: z.any().optional(),
  isComplete: z.boolean().optional(),
});

export function registerCharacterRoutes(app: FastifyInstance, uc: UseCases) {
  app.get("/campaigns/:id/characters", async (req) => {
    const { id } = req.params as { id: string };
    return uc.listCharacters.execute(req.user!.id, id);
  });

  app.get("/characters/:id", async (req) => {
    const { id } = req.params as { id: string };
    return uc.getCharacter.execute(req.user!.id, id);
  });

  app.post("/characters", async (req) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError();
    return uc.createCharacter.execute({ userId: req.user!.id, ...parsed.data });
  });

  app.patch("/characters/:id", async (req) => {
    const { id } = req.params as { id: string };
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError();
    return uc.updateCharacter.execute({ userId: req.user!.id, characterId: id, patch: parsed.data });
  });
}
