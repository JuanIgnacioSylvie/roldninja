import { describe, expect, it } from "vitest";
import { crValue } from "./monsters.js";

describe("crValue", () => {
  it("convierte CR fraccionario y entero para ordenar", () => {
    expect(crValue("1/8")).toBeCloseTo(0.125);
    expect(crValue("1/2")).toBe(0.5);
    expect(crValue("5")).toBe(5);
    expect(crValue("invalid")).toBe(0);
  });
});
