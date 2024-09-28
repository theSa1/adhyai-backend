import { db } from "@/db";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const querySchema = z.object({
  chatId: z.string(),
});

export const getChatHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { chatId } = querySchema.parse(req.query);

  const chat = await db.query.chatTable.findFirst({
    where: (t) => eq(t.id, chatId),
  });

  if (!chat) {
    return res.status(404).send({
      success: false,
      message: "Chat not found",
    });
  }

  const messages = await db.query.chatMessagesTable.findMany({
    where: (t) => eq(t.chatId, chatId),
  });

  return res.send({
    success: true,
    data: {
      chat,
      messages,
    },
  });
};
