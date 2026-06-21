import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ValidationError } from "@roldninja/domain";
import type { UseCases } from "../../composition/container.js";

const mapSchema = z.object({
  campaignId: z.string(),
  name: z.string().min(1),
  type: z.enum(["uploaded", "azgaar"]).default("uploaded"),
  fileUrl: z.string().nullable().optional(),
});

export function registerMapRoutes(app: FastifyInstance, uc: UseCases) {
  app.post("/uploads", async (req) => {
    const data = await req.file();
    if (!data) throw new ValidationError("No se envio archivo");
    return uc.uploadFile.execute({ filename: data.filename, data: data.file });
  });

  app.get("/campaigns/:id/maps", async (req) => {
    const { id } = req.params as { id: string };
    return uc.listWorldMaps.execute(id);
  });

  app.post("/maps", async (req) => {
    const parsed = mapSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError();
    return uc.createWorldMap.execute(parsed.data);
  });
}
