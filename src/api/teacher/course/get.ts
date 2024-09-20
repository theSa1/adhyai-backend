import { db } from "@/db";
import { coursesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const paramSchema = z.object({
  id: z.string(),
});

export const teacherCourseGetHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { id } = paramSchema.parse(req.params);

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, parseInt(id)))
    .execute();

  if (!course) {
    res.status(404).send({
      success: false,
      message: "Course not found",
    });
    return;
  }

  const units = await db.query.courseUnitsTable.findMany({
    where: (unit) => eq(unit.courseId, course.id),
    with: {
      documents: true,
    },
  });

  res.send({
    success: true,
    data: {
      name: course.name,
      id: course.id,
      rootDocumentId: course.rootDocumentId,
      units,
    },
  });
};
