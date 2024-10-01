import { db } from "@/db";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const querySchema = z.object({
  courseId: z.string(),
});

export const documentListGetHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { courseId } = querySchema.parse(req.query);

  const documents = await db.query.documentsTable.findMany({
    where: (t) => eq(t.courseId, courseId),
  });

  reply.send({
    success: true,
    data: documents.map((document) => ({
      id: document.id,
      name: document.name,
    })),
  });
};
