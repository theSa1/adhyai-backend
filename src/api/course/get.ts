import { db } from "@/db";
import { getAuth } from "@clerk/fastify";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";

export const getCoursesHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    throw new Error("Unauthorized");
  }

  const courses = await db.query.coursesTable.findMany({
    where: (t) => eq(t.userId, auth.userId),
  });

  res.send({
    success: true,
    data: courses.map((course) => ({
      id: course.id,
      name: course.name,
    })),
  });
};
