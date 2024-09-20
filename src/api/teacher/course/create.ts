import { db } from "@/db";
import { coursesTable, documentsTable } from "@/db/schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string(),
});

export const teacherCourseCreateHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { name } = bodySchema.parse(req.body);

  const [rootDocument] = await db
    .insert(documentsTable)
    .values({
      content: "",
      title: "Root",
    })
    .returning()
    .execute();

  const [course] = await db
    .insert(coursesTable)
    .values({
      name,
      createdBy: req.user!.userId,
      rootDocumentId: rootDocument.id,
    })
    .returning()
    .execute();

  res.send({
    success: true,
    data: {
      id: course.id,
      name: course.name,
    },
  });
};
