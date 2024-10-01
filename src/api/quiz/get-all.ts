import { db } from "@/db";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const querySchema = z.object({
  courseId: z.string(),
});

export const getAllQuizzesHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { courseId } = querySchema.parse(req.query);

  const quizzes = await db.query.quizzesTable.findMany({
    where: (t) => eq(t.courseId, courseId),
  });

  res.send({
    success: true,
    data: quizzes.map((quiz) => ({
      id: quiz.id,
      name: quiz.name,
      completed: quiz.isCompleted === 1,
      createdAt: quiz.createdAt,
    })),
  });
};
