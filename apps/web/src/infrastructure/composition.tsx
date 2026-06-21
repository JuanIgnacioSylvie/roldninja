"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ApiGateway } from "@/application/ports/ApiGateway";
import type { RealtimeGateway } from "@/application/ports/RealtimeGateway";
import { HttpApiClient } from "@/infrastructure/api/HttpApiClient";
import { SocketClient } from "@/infrastructure/realtime/SocketClient";
import { LocaleProvider } from "@/i18n/LocaleProvider";

interface AppServices {
  api: ApiGateway;
  realtime: RealtimeGateway;
}

const AppContext = createContext<AppServices | null>(null);

/**
 * Composition root del frontend: instancia los adaptadores concretos y los
 * inyecta a la presentacion via contexto. Es el unico lugar que conoce
 * implementaciones concretas (HTTP, Socket.IO).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const services = useMemo<AppServices>(
    () => ({ api: new HttpApiClient(), realtime: new SocketClient() }),
    [],
  );
  return (
    <LocaleProvider>
      <AppContext.Provider value={services}>{children}</AppContext.Provider>
    </LocaleProvider>
  );
}

function useServices(): AppServices {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppProviders no esta montado");
  return ctx;
}

export function useApi(): ApiGateway {
  return useServices().api;
}

export function useRealtime(): RealtimeGateway {
  return useServices().realtime;
}
