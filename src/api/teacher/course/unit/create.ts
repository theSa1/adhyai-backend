import { db } from "@/db";
import { coursesTable, courseUnitsTable, documentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const bodySchema = z.object({
  courseId: z.number().int(),
  name: z.string(),
});

export const teacherCourseUnitCreateHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { name, courseId } = bodySchema.parse(req.body);

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId))
    .execute();

  if (!course || course.createdBy !== req.user!.userId) {
    res.status(404).send({
      success: false,
      message: "Course not found",
    });
    return;
  }

  const [rootDocument] = await db
    .insert(documentsTable)
    .values({
      content: "",
      title: "Unit Root",
    })
    .returning()
    .execute();

  const [unit] = await db
    .insert(courseUnitsTable)
    .values({
      name,
      courseId: course.id,
      rootDocumentId: rootDocument.id,
    })
    .returning()
    .execute();

  res.send({
    success: true,
    data: {
      id: unit.id,
      name: unit.name,
    },
  });
};
