"use client";
import { DiceService, type RandomGenerator } from "@roldninja/domain";

/** RNG del navegador (Math.random) para tiradas del lado cliente. */
const browserRng: RandomGenerator = {
  rollDie: (sides: number) => Math.floor(Math.random() * sides) + 1,
};

/** Servicio de dados compartido en el cliente (p. ej. salvaciones de muerte). */
export const dice = new DiceService(browserRng);
