import { describe, expect, it } from "vitest";
import { CampaignState, type InitiativeEntry } from "./CampaignState.js";

const entry = (overrides: Partial<InitiativeEntry> = {}): InitiativeEntry => ({
  characterId: "char-1",
  userId: "user-1",
  name: "Hero",
  initiative: 0,
  pending: true,
  ...overrides,
});

const baseSnapshot = () => ({
  campaignId: "camp-1",
  mode: "FREE" as const,
  activeBoardId: null,
  round: 0,
  turnIndex: 0,
  initiative: [] as InitiativeEntry[],
});

describe("CampaignState", () => {
  it("inicia combate con orden e indice en cero", () => {
    const state = CampaignState.fromSnapshot(baseSnapshot());
    const order = [entry({ characterId: "a", initiative: 18 }), entry({ characterId: "b", initiative: 12 })];

    state.startCombat(order);

    expect(state.mode).toBe("COMBAT");
    expect(state.round).toBe(1);
    expect(state.turnIndex).toBe(0);
    expect(state.initiative).toHaveLength(2);
    expect(state.currentParticipant()?.characterId).toBe("a");
  });

  it("finaliza combate y limpia iniciativa", () => {
    const state = CampaignState.fromSnapshot(baseSnapshot());
    state.startCombat([entry({ initiative: 10, pending: false })]);
    state.endCombat();

    expect(state.mode).toBe("FREE");
    expect(state.initiative).toEqual([]);
    expect(state.round).toBe(0);
    expect(state.turnIndex).toBe(0);
  });

  it("registra tirada y cancelacion de iniciativa", () => {
    const state = CampaignState.fromSnapshot({
      ...baseSnapshot(),
      mode: "COMBAT",
      round: 1,
      initiative: [entry({ characterId: "hero" })],
    });

    expect(state.setParticipantInitiative("hero", 14)).toBe(true);
    expect(state.initiative[0]?.initiative).toBe(14);
    expect(state.initiative[0]?.pending).toBe(false);

    expect(state.cancelParticipantInitiative("hero")).toBe(true);
    expect(state.initiative[0]?.initiative).toBe(0);
    expect(state.setParticipantInitiative("missing", 10)).toBe(false);
  });

  it("reordena iniciativa y cambia tablero activo", () => {
    const state = CampaignState.fromSnapshot({
      ...baseSnapshot(),
      mode: "COMBAT",
      round: 1,
      initiative: [
        entry({ characterId: "a", initiative: 18, pending: false }),
        entry({ characterId: "b", initiative: 12, pending: false }),
      ],
    });

    const reordered = [
      entry({ characterId: "b", initiative: 12, pending: false }),
      entry({ characterId: "a", initiative: 18, pending: false }),
    ];
    state.setInitiativeOrder(reordered);
    expect(state.initiative[0]?.characterId).toBe("b");

    state.setActiveBoard("board-42");
    expect(state.toSnapshot().activeBoardId).toBe("board-42");
  });

  it("avanza turno y aumenta ronda al volver al inicio", () => {
    const state = CampaignState.fromSnapshot({
      ...baseSnapshot(),
      mode: "COMBAT",
      round: 1,
      turnIndex: 1,
      initiative: [
        entry({ characterId: "a", initiative: 18, pending: false }),
        entry({ characterId: "b", initiative: 12, pending: false }),
      ],
    });

    state.advanceTurn();

    expect(state.turnIndex).toBe(0);
    expect(state.round).toBe(2);
  });

  it("expone snapshot inmutable", () => {
    const state = CampaignState.fromSnapshot(baseSnapshot());
    state.startCombat([entry({ initiative: 5, pending: false })]);

    const snapshot = state.toSnapshot();
    snapshot.initiative.push(entry({ characterId: "extra" }));

    expect(state.initiative).toHaveLength(1);
  });
});
