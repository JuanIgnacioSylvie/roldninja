import {

  ForbiddenError,

  NotFoundError,

  ValidationError,

  type CampaignRepository,

} from "@roldninja/domain";

import type { PasswordHasher } from "../../ports/PasswordHasher.js";



/** Agrega a un jugador como miembro de una partida existente. */

export class EnrollInCampaign {

  constructor(

    private readonly campaigns: CampaignRepository,

    private readonly hasher: PasswordHasher,

  ) {}



  async execute(userId: string, campaignId: string, joinPassword?: string): Promise<void> {

    const campaign = await this.campaigns.findById(campaignId);

    if (!campaign) throw new NotFoundError("Partida no encontrada");

    if (campaign.dmId === userId) {

      throw new ValidationError("Ya sos el DM de esta partida");

    }

    if (await this.campaigns.isMember(campaignId, userId)) {

      throw new ValidationError("Ya estás en esta partida");

    }



    if (campaign.visibility === "private") {

      if (!campaign.joinPasswordHash) {

        throw new ValidationError("Esta partida privada no acepta nuevos jugadores");

      }

      if (!joinPassword?.trim()) {

        throw new ValidationError("Se requiere la contraseña de la partida");

      }

      const ok = await this.hasher.compare(joinPassword, campaign.joinPasswordHash);

      if (!ok) throw new ForbiddenError("Contraseña incorrecta");

    }



    await this.campaigns.addMember(campaignId, userId);

  }

}

