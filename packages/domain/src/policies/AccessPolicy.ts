import type { Campaign } from "../entities/Campaign.js";

/** Reglas de autorizacion puras (sin acceso a datos). */
export const AccessPolicy = {
  isDM(campaign: Campaign, userId: string): boolean {
    return campaign.dmId === userId;
  },

  /** Acceso a la partida: es el DM o es miembro (membership resuelto afuera). */
  canAccess(campaign: Campaign, userId: string, isMember: boolean): boolean {
    return campaign.dmId === userId || isMember;
  },
};
