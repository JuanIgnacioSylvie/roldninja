import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ValidationError } from "@roldninja/domain";
import type { UseCases } from "../../composition/container.js";

const createSchema = z.object({
  campaignId: z.string(),
  name: z.string().min(1),
  cols: z.number().int().min(1).max(100).default(20),
  rows: z.number().int().min(1).max(100).default(20),
  backgroundUrl: z.string().nullable().optional(),
});

const updateSchema = z.object({
  name: z.string().optional(),
  cols: z.number().int().min(1).max(100).optional(),
  rows: z.number().int().min(1).max(100).optional(),
  backgroundUrl: z.string().nullable().optional(),
  gridColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  gridOpacity: z.number().min(0).max(1).optional(),
  gridLineWidth: z.number().min(0.5).max(8).optional(),
  isActive: z.boolean().optional(),
});

export function registerBoardRoutes(app: FastifyInstance, uc: UseCases) {
  app.get("/campaigns/:id/boards", async (req) => {
    const { id } = req.params as { id: string };
    return uc.listBoards.execute(req.user!.id, id);
  });

  app.post("/boards", async (req) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError();
    return uc.createBoard.execute({ userId: req.user!.id, ...parsed.data });
  });

  app.patch("/boards/:id", async (req) => {
    const { id } = req.params as { id: string };
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError();
    return uc.updateBoard.execute({ userId: req.user!.id, boardId: id, patch: parsed.data });
  });

  app.delete("/boards/:id", async (req) => {
    const { id } = req.params as { id: string };
    await uc.deleteBoard.execute({ userId: req.user!.id, boardId: id });
    return { success: true };
  });
}
