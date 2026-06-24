import type { FastifyInstance } from "fastify";

import { z } from "zod";

import { ValidationError } from "@roldninja/domain";

import type { UseCases } from "../../composition/container.js";



const createSchema = z.object({

  name: z.string().min(1),

  description: z.string().optional(),

  abilityScoreMethod: z.enum(["pointbuy", "array"]).optional(),

  visibility: z.enum(["public", "private"]).optional(),

  joinPassword: z.string().optional(),

});



const joinSchema = z.object({

  joinPassword: z.string().optional(),

});



/** Rutas de partidas (montadas dentro del scope autenticado). */

export function registerCampaignRoutes(app: FastifyInstance, uc: UseCases) {

  app.get("/me", async (req) => ({ user: req.user }));



  app.get("/campaigns", async (req) => uc.listCampaigns.execute(req.user!.id));



  app.get("/campaigns/public", async (req) => uc.listPublicCampaigns.execute(req.user!.id));



  app.get("/campaigns/:id", async (req) => {

    const { id } = req.params as { id: string };

    return uc.getCampaign.execute(req.user!.id, id);

  });



  app.post("/campaigns", async (req) => {

    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) throw new ValidationError();

    return uc.createCampaign.execute({ user: req.user!, ...parsed.data });

  });



  app.post("/campaigns/:id/join", async (req) => {

    const { id } = req.params as { id: string };

    const parsed = joinSchema.safeParse(req.body ?? {});

    if (!parsed.success) throw new ValidationError();

    await uc.enrollInCampaign.execute(req.user!.id, id, parsed.data.joinPassword);

    return { success: true };

  });

}

