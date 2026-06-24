import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/infrastructure/composition";

const fontHero = localFont({
  src: [
    { path: "../fonts/cinzel-decorative/CinzelDecorative-Regular.ttf", weight: "400" },
    { path: "../fonts/cinzel-decorative/CinzelDecorative-Bold.ttf", weight: "700" },
    { path: "../fonts/cinzel-decorative/CinzelDecorative-Black.ttf", weight: "900" },
  ],
  variable: "--font-hero",
  display: "swap",
});

const fontBody = localFont({
  src: [
    { path: "../fonts/philosopher/Philosopher-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/philosopher/Philosopher-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/philosopher/Philosopher-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/philosopher/Philosopher-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roldninja",
  description: "Roldninja — mesa virtual para jugar D&D 2024 online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontHero.variable} ${fontBody.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
