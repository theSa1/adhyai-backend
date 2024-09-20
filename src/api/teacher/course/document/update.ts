import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const bodySchema = z.object({
  id: z.number().int(),
  title: z.string(),
  content: z.string(),
});

export const teacherDocumentUpdateHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { id, title, content } = bodySchema.parse(req.body);

  const [document] = await db
    .update(documentsTable)
    .set({
      title,
      content,
    })
    .where(eq(documentsTable.id, id))
    .returning()
    .execute();

  if (!document) {
    res.status(404).send({
      success: false,
      message: "Document not found",
    });
    return;
  }

  res.send({
    success: true,
  });
};
