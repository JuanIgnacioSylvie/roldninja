import {
  ForbiddenError,
  NotFoundError,
  type Character,
  type CharacterRepository,
  type UpdateCharacterInput as RepoUpdateInput,
} from "@roldninja/domain";

export interface UpdateCharacterInput {
  userId: string;
  characterId: string;
  patch: RepoUpdateInput;
}

export class UpdateCharacter {
  constructor(private readonly characters: CharacterRepository) {}

  async execute({ userId, characterId, patch }: UpdateCharacterInput): Promise<Character> {
    const character = await this.characters.findById(characterId);
    if (!character) throw new NotFoundError("Personaje no encontrado");
    if (character.ownerId !== userId) throw new ForbiddenError("No es tu personaje");
    return this.characters.update(characterId, patch);
  }
}
