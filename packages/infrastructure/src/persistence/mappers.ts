import type {
  Board,
  Campaign,
  AbilityScoreMethod,
  Character,
  CharacterSheet,
  ChatKind,
  ChatMessage,
  Token,
  User,
  WorldMap,
  WorldMapType,
} from "@roldninja/domain";

/* eslint-disable @typescript-eslint/no-explicit-any */

function toAbilityScoreMethod(value: string | undefined): AbilityScoreMethod {
  return value === "STANDARD_ARRAY" ? "array" : "pointbuy";
}

function toCampaignVisibility(value: string | undefined): "public" | "private" {
  return value === "PUBLIC" ? "public" : "private";
}

export function fromAbilityScoreMethod(method: AbilityScoreMethod): "POINT_BUY" | "STANDARD_ARRAY" {
  return method === "array" ? "STANDARD_ARRAY" : "POINT_BUY";
}

export function fromCampaignVisibility(visibility: "public" | "private"): "PUBLIC" | "PRIVATE" {
  return visibility === "public" ? "PUBLIC" : "PRIVATE";
}

export function toUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    displayName: row.displayName,
  };
}

export function toCampaign(row: any): Campaign {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    abilityScoreMethod: toAbilityScoreMethod(row.abilityScoreMethod),
    visibility: toCampaignVisibility(row.visibility),
    joinPasswordHash: row.joinPasswordHash ?? null,
    dmId: row.dmId,
    createdAt: row.createdAt,
  };
}

export function toCharacter(row: any): Character {
  return {
    id: row.id,
    campaignId: row.campaignId,
    ownerId: row.ownerId,
    name: row.name,
    species: row.species ?? null,
    class: row.class ?? null,
    background: row.background ?? null,
    level: row.level,
    sheet: (row.sheet ?? {}) as Partial<CharacterSheet>,
    isComplete: row.isComplete,
  };
}

export function toToken(row: any): Token {
  return {
    id: row.id,
    boardId: row.boardId,
    characterId: row.characterId ?? null,
    label: row.label,
    x: row.x,
    y: row.y,
    color: row.color,
    imageUrl: row.imageUrl ?? null,
    size: row.size,
    hidden: row.hidden,
    hp: row.hp ?? null,
    maxHp: row.maxHp ?? null,
  };
}

export function toBoard(row: any): Board {
  return {
    id: row.id,
    campaignId: row.campaignId,
    name: row.name,
    cols: row.cols,
    rows: row.rows,
    backgroundUrl: row.backgroundUrl ?? null,
    gridColor: row.gridColor ?? "#ffffff",
    gridOpacity: row.gridOpacity ?? 0.08,
    gridLineWidth: row.gridLineWidth ?? 1,
    isActive: row.isActive,
    tokens: Array.isArray(row.tokens) ? row.tokens.map(toToken) : [],
  };
}

export function toWorldMap(row: any): WorldMap {
  return {
    id: row.id,
    campaignId: row.campaignId,
    name: row.name,
    type: row.type as WorldMapType,
    fileUrl: row.fileUrl ?? null,
    createdAt: row.createdAt,
  };
}

export function toChatMessage(row: any, authorName: string): ChatMessage {
  return {
    id: row.id,
    campaignId: row.campaignId,
    userId: row.userId ?? null,
    authorName,
    kind: row.kind as ChatKind,
    content: row.content,
    payload: row.payload ?? undefined,
    createdAt: row.createdAt,
  };
}
