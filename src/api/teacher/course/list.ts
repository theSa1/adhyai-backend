import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "@/db";
import { coursesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const teacherCourseListHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const courses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.createdBy, req.user!.userId))
    .execute();

  res.send({
    success: true,
    data: courses.map((course) => ({
      id: course.id,
      name: course.name,
    })),
  });
};
