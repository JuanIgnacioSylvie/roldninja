import { prisma } from "@roldninja/db";
import { DiceService } from "@roldninja/domain";
import {
  LoginUser,
  ListCampaigns,
  ListPublicCampaigns,
  GetCampaign,
  CreateCampaign,
  EnrollInCampaign,
  ListCharacters,
  GetCharacter,
  CreateCharacter,
  UpdateCharacter,
  ListBoards,
  CreateBoard,
  UpdateBoard,
  DeleteBoard,
  ListWorldMaps,
  CreateWorldMap,
  UploadFile,
  JoinCampaign,
  SendChatMessage,
  RollDice,
  PatchCharacterSheet,
  SetMode,
  SetInitiative,
  RollInitiative,
  CancelInitiative,
  NextTurn,
  SetActiveBoard,
  MoveToken,
  UpsertToken,
  RemoveToken,
  type TokenService,
} from "@roldninja/application";
import {
  BcryptPasswordHasher,
  JwtTokenService,
  LocalFileStorage,
  MathRandomGenerator,
  PrismaUserRepository,
  PrismaCampaignRepository,
  PrismaCharacterRepository,
  PrismaBoardRepository,
  PrismaTokenRepository,
  PrismaWorldMapRepository,
  PrismaChatRepository,
  PrismaCampaignStateRepository,
} from "@roldninja/infrastructure";
import { env } from "../config/env.js";

/**
 * Composition root: cablea manualmente todas las dependencias (sin contenedor DI).
 * Es el unico lugar que conoce implementaciones concretas.
 */
export function createContainer() {
  // Servicios / gateways
  const rng = new MathRandomGenerator();
  const dice = new DiceService(rng);
  const hasher = new BcryptPasswordHasher();
  const tokenService: TokenService = new JwtTokenService(env.jwtSecret);
  const fileStorage = new LocalFileStorage(env.uploadDir);

  // Repositorios (Prisma)
  const users = new PrismaUserRepository(prisma);
  const campaigns = new PrismaCampaignRepository(prisma);
  const characters = new PrismaCharacterRepository(prisma);
  const boards = new PrismaBoardRepository(prisma);
  const tokens = new PrismaTokenRepository(prisma);
  const worldMaps = new PrismaWorldMapRepository(prisma);
  const chats = new PrismaChatRepository(prisma);
  const states = new PrismaCampaignStateRepository(prisma);

  // Casos de uso
  const useCases = {
    login: new LoginUser(users, hasher, tokenService),

    listCampaigns: new ListCampaigns(campaigns),
    listPublicCampaigns: new ListPublicCampaigns(campaigns),
    getCampaign: new GetCampaign(campaigns, users, states),
    createCampaign: new CreateCampaign(campaigns, hasher),
    enrollInCampaign: new EnrollInCampaign(campaigns, hasher),

    listCharacters: new ListCharacters(campaigns, characters),
    getCharacter: new GetCharacter(campaigns, characters),
    createCharacter: new CreateCharacter(campaigns, characters),
    updateCharacter: new UpdateCharacter(characters),

    listBoards: new ListBoards(campaigns, boards),
    createBoard: new CreateBoard(campaigns, boards),
    updateBoard: new UpdateBoard(campaigns, boards),
    deleteBoard: new DeleteBoard(campaigns, boards, states),

    listWorldMaps: new ListWorldMaps(worldMaps),
    createWorldMap: new CreateWorldMap(worldMaps),

    uploadFile: new UploadFile(fileStorage),

    joinCampaign: new JoinCampaign(campaigns, chats, states),
    sendChat: new SendChatMessage(campaigns, chats),
    rollDice: new RollDice(campaigns, chats, dice),
    patchSheet: new PatchCharacterSheet(campaigns, characters, tokens, boards),

    setMode: new SetMode(campaigns, characters, states),
    setInitiative: new SetInitiative(campaigns, states),
    rollInitiative: new RollInitiative(campaigns, characters, states, dice),
    cancelInitiative: new CancelInitiative(campaigns, states),
    nextTurn: new NextTurn(campaigns, states),
    setActiveBoard: new SetActiveBoard(campaigns, boards, states),

    moveToken: new MoveToken(boards, tokens, campaigns, characters),
    upsertToken: new UpsertToken(boards, tokens, characters),
    removeToken: new RemoveToken(boards, tokens),
  };

  return { tokenService, useCases };
}

export type Container = ReturnType<typeof createContainer>;
export type UseCases = Container["useCases"];
