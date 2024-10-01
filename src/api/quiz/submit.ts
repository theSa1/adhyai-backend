import { db } from "@/db";
import { quizQuestionsTable, quizzesTable } from "@/db/schema";
import { evaluateQuiz } from "@/lib/evaluate-quiz";
import { and, asc, eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const bodySchema = z.object({
  quizId: z.string(),
  answers: z.array(z.string()),
});

export const submitQuizHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { quizId, answers } = bodySchema.parse(req.body);

  const quiz = await db.query.quizzesTable.findFirst({
    where: (t) => and(eq(t.id, quizId), eq(t.isCompleted, 0)),
    with: {
      questions: {
        orderBy: (t) => asc(t.index),
      },
    },
  });

  const result = await evaluateQuiz(quiz.questions, answers);

  await Promise.all(
    result.map(async (r, i) => {
      await db
        .update(quizQuestionsTable)
        .set({
          givenAnswer: answers[i],
          feedback: r.feedback,
          marks: r.marks,
        })
        .where(eq(quizQuestionsTable.id, quiz.questions[i].id))
        .execute();
    })
  );

  await db
    .update(quizzesTable)
    .set({
      isCompleted: 1,
    })
    .where(eq(quizzesTable.id, quizId))
    .execute();

  res.send({
    success: true,
    data: result,
  });
};
