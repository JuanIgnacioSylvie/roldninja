"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUserDTO } from "@roldninja/contracts";

interface AuthState {
  token: string | null;
  user: AuthUserDTO | null;
  setAuth: (token: string, user: AuthUserDTO) => void;
  logout: () => void;
}

/** Estado de autenticacion persistido (adaptador concreto de almacenamiento). */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "roldninja-auth" },
  ),
);
