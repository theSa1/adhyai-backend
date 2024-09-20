import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string(),
});

export const teacherDocumentGetHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { id } = paramsSchema.parse(req.params);

  const [document] = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.id, parseInt(id)))
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
    data: {
      id: document.id,
      title: document.title,
      content: document.content,
    },
  });
};
