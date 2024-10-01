import { db } from "@/db";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const querySchema = z.object({
  quizId: z.string(),
});

export const getQuizHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { quizId } = querySchema.parse(req.query);

  const quiz = await db.query.quizzesTable.findFirst({
    where: (t) => eq(t.id, quizId),
    with: {
      questions: true,
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  if (quiz.isCompleted === 1) {
    res.send({
      success: true,
      data: {
        name: quiz.name,
        id: quiz.id,
        completed: true,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          question: question.question,
          options: question.options?.split("@@@"),
          questionType: question.questionType,
          givenAnswer: question.givenAnswer,
          feedback: question.feedback,
          marks: question.marks,
        })),
      },
    });
  } else {
    res.send({
      success: true,
      data: {
        name: quiz.name,
        id: quiz.id,
        completed: false,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          question: question.question,
          options: question.options?.split("@@@"),
          questionType: question.questionType,
        })),
      },
    });
  }
};
