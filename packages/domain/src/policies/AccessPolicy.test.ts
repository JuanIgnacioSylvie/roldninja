import { describe, expect, it } from "vitest";
import type { Campaign } from "../entities/Campaign.js";
import { AccessPolicy } from "./AccessPolicy.js";

const campaign = (overrides: Partial<Campaign> = {}): Campaign => ({
  id: "camp-1",
  name: "Lost Mine",
  description: null,
  abilityScoreMethod: "pointbuy",
  dmId: "dm-1",
  createdAt: new Date("2024-01-01"),
  ...overrides,
});

describe("AccessPolicy", () => {
  it("identifica al DM", () => {
    expect(AccessPolicy.isDM(campaign(), "dm-1")).toBe(true);
    expect(AccessPolicy.isDM(campaign(), "player-1")).toBe(false);
  });

  it("permite acceso al DM o miembros", () => {
    expect(AccessPolicy.canAccess(campaign(), "dm-1", false)).toBe(true);
    expect(AccessPolicy.canAccess(campaign(), "player-1", true)).toBe(true);
    expect(AccessPolicy.canAccess(campaign(), "player-1", false)).toBe(false);
  });
});
