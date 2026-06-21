import type { Token } from "./Token.js";

export interface Board {
  id: string;
  campaignId: string;
  name: string;
  cols: number;
  rows: number;
  backgroundUrl: string | null;
  gridColor: string;
  gridOpacity: number;
  gridLineWidth: number;
  isActive: boolean;
  tokens: Token[];
}
