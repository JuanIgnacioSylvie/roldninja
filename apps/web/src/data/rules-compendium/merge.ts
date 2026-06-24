import type { CompendiumRule } from "@/lib/rules-compendium";

/** Later entries in `overrides` win when ids collide. */
export function mergeCompendiumEntries(
  base: CompendiumRule[],
  ...overrides: CompendiumRule[][]
): CompendiumRule[] {
  const map = new Map<string, CompendiumRule>();
  for (const entry of base) map.set(entry.id, entry);
  for (const group of overrides) {
    for (const entry of group) map.set(entry.id, entry);
  }
  return [...map.values()];
}
