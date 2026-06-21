export type CampaignMode = "FREE" | "COMBAT";

export interface InitiativeEntry {
  characterId: string | null;
  userId: string | null;
  name: string;
  initiative: number;
  /** true cuando el participante todavia no tiro / cancelo. */
  pending?: boolean;
  /** URL de imagen para el token en el widget de orden de turno. */
  imageUrl?: string | null;
  /** Color del token si no hay imagen. */
  color?: string;
  /** Tipo de participante para estilizado visual. */
  kind?: "player" | "npc" | "monster";
}

export interface CampaignStateSnapshot {
  campaignId: string;
  mode: CampaignMode;
  activeBoardId: string | null;
  round: number;
  turnIndex: number;
  initiative: InitiativeEntry[];
}

/**
 * Entidad de estado vivo de la partida. Concentra las transiciones de combate
 * como invariantes de dominio (inicio/fin, iniciativa, avance de turno).
 */
export class CampaignState {
  private constructor(private props: CampaignStateSnapshot) {}

  static fromSnapshot(props: CampaignStateSnapshot): CampaignState {
    return new CampaignState({ ...props, initiative: [...props.initiative] });
  }

  get campaignId(): string {
    return this.props.campaignId;
  }
  get mode(): CampaignMode {
    return this.props.mode;
  }
  get turnIndex(): number {
    return this.props.turnIndex;
  }
  get round(): number {
    return this.props.round;
  }
  get initiative(): InitiativeEntry[] {
    return [...this.props.initiative];
  }

  /** Participante cuyo turno es actualmente, o undefined. */
  currentParticipant(): InitiativeEntry | undefined {
    return this.props.initiative[this.props.turnIndex];
  }

  startCombat(initiative: InitiativeEntry[]): void {
    this.props.mode = "COMBAT";
    this.props.initiative = [...initiative];
    this.props.round = 1;
    this.props.turnIndex = 0;
  }

  endCombat(): void {
    this.props.mode = "FREE";
    this.props.initiative = [];
    this.props.round = 0;
    this.props.turnIndex = 0;
  }

  setInitiativeOrder(order: InitiativeEntry[]): void {
    this.props.initiative = [...order];
  }

  setParticipantInitiative(characterId: string, total: number): boolean {
    const entry = this.props.initiative.find((e) => e.characterId === characterId);
    if (!entry) return false;
    entry.initiative = total;
    entry.pending = false;
    return true;
  }

  cancelParticipantInitiative(characterId: string): boolean {
    const entry = this.props.initiative.find((e) => e.characterId === characterId);
    if (!entry) return false;
    entry.pending = false;
    entry.initiative = 0;
    return true;
  }

  advanceTurn(): void {
    const count = this.props.initiative.length || 1;
    let turnIndex = this.props.turnIndex + 1;
    let round = this.props.round;
    if (turnIndex >= count) {
      turnIndex = 0;
      round += 1;
    }
    this.props.turnIndex = turnIndex;
    this.props.round = round;
  }

  setActiveBoard(boardId: string | null): void {
    this.props.activeBoardId = boardId;
  }

  toSnapshot(): CampaignStateSnapshot {
    return { ...this.props, initiative: [...this.props.initiative] };
  }
}
