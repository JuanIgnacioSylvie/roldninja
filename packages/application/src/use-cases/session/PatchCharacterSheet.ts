import {
  ForbiddenError,
  NotFoundError,
  mergeCharacterSheet,
  type AuthenticatedUser,
  type Board,
  type BoardRepository,
  type CampaignRepository,
  type CharacterRepository,
  type CharacterSheet,
  type TokenRepository,
} from "@roldninja/domain";
import { AccessChecker } from "../../services/AccessChecker.js";

export interface PatchCharacterSheetInput {
  user: AuthenticatedUser;
  campaignId: string;
  characterId: string;
  patch: Partial<CharacterSheet>;
}

export interface PatchCharacterSheetResult {
  sheet: CharacterSheet;
  affectedBoards: Board[];
}

export class PatchCharacterSheet {
  private readonly access: AccessChecker;

  constructor(
    campaigns: CampaignRepository,
    private readonly characters: CharacterRepository,
    private readonly tokens: TokenRepository,
    private readonly boards: BoardRepository,
  ) {
    this.access = new AccessChecker(campaigns);
  }

  async execute({ user, campaignId, characterId, patch }: PatchCharacterSheetInput): Promise<PatchCharacterSheetResult> {
    await this.access.ensureAccess(campaignId, user.id);
    const character = await this.characters.findById(characterId);
    if (!character || character.campaignId !== campaignId) throw new NotFoundError("Personaje no encontrado");

    const isDM = await this.access.isDM(campaignId, user.id);
    if (character.ownerId !== user.id && !isDM) throw new ForbiddenError("No podes editar esta hoja");

    const merged = mergeCharacterSheet(character.sheet, patch);
    await this.characters.update(characterId, { sheet: merged });

    const affectedBoards: Board[] = [];
    if (typeof merged.currentHp === "number" || typeof merged.maxHp === "number") {
      const linked = await this.tokens.listByCharacter(characterId);
      for (const tk of linked) {
        await this.tokens.update(tk.id, {
          hp: typeof merged.currentHp === "number" ? merged.currentHp : tk.hp,
          maxHp: typeof merged.maxHp === "number" ? merged.maxHp : tk.maxHp,
        });
      }
      const boardIds = [...new Set(linked.map((t) => t.boardId))];
      for (const boardId of boardIds) {
        const board = await this.boards.findById(boardId);
        if (board) affectedBoards.push(board);
      }
    }

    return { sheet: merged as CharacterSheet, affectedBoards };
  }
}
