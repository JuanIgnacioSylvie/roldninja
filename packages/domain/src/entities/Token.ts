export interface Token {
  id: string;
  boardId: string;
  characterId: string | null;
  label: string;
  x: number;
  y: number;
  color: string;
  imageUrl: string | null;
  size: number;
  hidden: boolean;
  hp: number | null;
  maxHp: number | null;
}

/** Datos para crear/actualizar un token (campos opcionales para upsert). */
export type TokenDraft = Partial<Token> & { id?: string };

export const DEFAULT_TOKEN = {
  label: "Token",
  x: 0,
  y: 0,
  color: "#e11d48",
  size: 1,
  hidden: false,
} as const;
