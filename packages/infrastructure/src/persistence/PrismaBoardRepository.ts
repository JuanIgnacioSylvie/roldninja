import type { PrismaClient } from "@roldninja/db";
import type {
  Board,
  BoardRepository,
  CreateBoardInput,
  UpdateBoardInput,
} from "@roldninja/domain";
import { toBoard } from "./mappers.js";

export class PrismaBoardRepository implements BoardRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByCampaign(campaignId: string): Promise<Board[]> {
    const rows = await this.prisma.board.findMany({
      where: { campaignId },
      include: { tokens: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toBoard);
  }

  async findById(id: string): Promise<Board | null> {
    const row = await this.prisma.board.findUnique({ where: { id }, include: { tokens: true } });
    return row ? toBoard(row) : null;
  }

  async create(input: CreateBoardInput): Promise<Board> {
    const row = await this.prisma.board.create({
      data: {
        campaignId: input.campaignId,
        name: input.name,
        cols: input.cols,
        rows: input.rows,
        backgroundUrl: input.backgroundUrl ?? null,
      },
      include: { tokens: true },
    });
    return toBoard(row);
  }

  async update(id: string, patch: UpdateBoardInput): Promise<Board> {
    const data: Record<string, unknown> = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.cols !== undefined) data.cols = patch.cols;
    if (patch.rows !== undefined) data.rows = patch.rows;
    if (patch.backgroundUrl !== undefined) data.backgroundUrl = patch.backgroundUrl;
    if (patch.gridColor !== undefined) data.gridColor = patch.gridColor;
    if (patch.gridOpacity !== undefined) data.gridOpacity = patch.gridOpacity;
    if (patch.gridLineWidth !== undefined) data.gridLineWidth = patch.gridLineWidth;
    if (patch.isActive !== undefined) data.isActive = patch.isActive;

    const row = await this.prisma.board.update({
      where: { id },
      data,
      include: { tokens: true },
    });
    return toBoard(row);
  }

  async setActiveExclusive(campaignId: string, boardId: string): Promise<void> {
    await this.prisma.board.updateMany({ where: { campaignId }, data: { isActive: false } });
    await this.prisma.board.update({ where: { id: boardId }, data: { isActive: true } });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.board.delete({ where: { id } });
  }
}
