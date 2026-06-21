import { describe, expect, it } from "vitest";
import { toAuthenticatedUser } from "./User.js";

describe("toAuthenticatedUser", () => {
  it("expone identidad sin el hash de contraseña", () => {
    const auth = toAuthenticatedUser({
      id: "u1",
      username: "dm",
      passwordHash: "secret-hash",
      displayName: "Dungeon Master",
    });

    expect(auth).toEqual({
      id: "u1",
      username: "dm",
      displayName: "Dungeon Master",
    });
    expect(auth).not.toHaveProperty("passwordHash");
  });
});
