import {

  type Campaign,

  type CampaignRepository,

  type AuthenticatedUser,

  type AbilityScoreMethod,

  type CampaignVisibility,

  ValidationError,

} from "@roldninja/domain";

import type { PasswordHasher } from "../../ports/PasswordHasher.js";



export interface CreateCampaignInput {

  user: AuthenticatedUser;

  name: string;

  description?: string;

  abilityScoreMethod?: AbilityScoreMethod;

  visibility?: CampaignVisibility;

  joinPassword?: string;

}



export class CreateCampaign {

  constructor(

    private readonly campaigns: CampaignRepository,

    private readonly hasher: PasswordHasher,

  ) {}



  async execute({

    user,

    name,

    description,

    abilityScoreMethod,

    visibility = "private",

    joinPassword,

  }: CreateCampaignInput): Promise<Campaign> {

    if (visibility === "private" && !joinPassword?.trim()) {

      throw new ValidationError("Las partidas privadas requieren contraseña");

    }



    const joinPasswordHash =

      visibility === "private" && joinPassword ? await this.hasher.hash(joinPassword) : null;



    return this.campaigns.create({

      name,

      description: description ?? null,

      abilityScoreMethod: abilityScoreMethod ?? "pointbuy",

      visibility,

      joinPasswordHash,

      dmId: user.id,

    });

  }

}

