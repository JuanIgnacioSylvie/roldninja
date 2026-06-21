export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";
export const AZGAAR_URL = process.env.NEXT_PUBLIC_AZGAAR_URL ?? "/azgaar/index.html";

/** Resuelve una ruta de asset a URL usable en el cliente. */
export function assetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${SERVER_URL}${path}`;
  if (path.startsWith("/")) return path;
  return `${SERVER_URL}${path}`;
}
