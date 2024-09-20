import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "@/db";
import { coursesTable } from "@/db/schema";

export const studentCourseListHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const courses = await db.select().from(coursesTable).execute();

  res.send({
    success: true,
    data: courses,
  });
};
