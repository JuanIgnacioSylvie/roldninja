import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/infrastructure/composition";

export const metadata: Metadata = {
  title: "Roldninja",
  description: "Roldninja — mesa virtual para jugar D&D 2024 online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
