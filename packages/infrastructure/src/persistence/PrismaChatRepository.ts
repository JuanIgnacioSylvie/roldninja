import type { PrismaClient } from "@roldninja/db";
import type { ChatMessage, ChatRepository, CreateChatMessageInput } from "@roldninja/domain";
import { toChatMessage } from "./mappers.js";

export class PrismaChatRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listRecent(campaignId: string, limit: number): Promise<ChatMessage[]> {
    const rows = await this.prisma.chatMessage.findMany({
      where: { campaignId },
      include: { user: { select: { displayName: true } } },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
    return rows.map((r) => toChatMessage(r, r.user?.displayName ?? "Servidor"));
  }

  async create(input: CreateChatMessageInput): Promise<ChatMessage> {
    const row = await this.prisma.chatMessage.create({
      data: {
        campaignId: input.campaignId,
        userId: input.userId,
        kind: input.kind,
        content: input.content,
        payload: input.payload === undefined ? undefined : (input.payload as object),
      },
    });
    return toChatMessage(row, input.authorName);
  }
}
