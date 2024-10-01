import { db } from "@/db";
import { coursesTable } from "@/db/schema";
import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(3).max(255),
});

export const addCourseHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { name } = bodySchema.parse(req.body);
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    throw new Error("Unauthorized");
  }

  await db
    .insert(coursesTable)
    .values({
      name: name,
      userId: auth.userId,
    })
    .execute();

  res.send({
    success: true,
  });
};
