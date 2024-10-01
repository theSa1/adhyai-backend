import { generateObject } from "ai";
import { model } from "./llm";
import { z } from "zod";
import { getRetriever } from "./vector-store";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { quizQuestionsTable, quizzesTable } from "@/db/schema";

export const startQuiz = async (instructions: string, courseId: string) => {
  const retrievedDocs = await getRetriever(courseId).invoke(instructions);
  const joinedPageContents = retrievedDocs
    .map((doc) => doc.pageContent)
    .join("\n\n");

  const res = await generateObject({
    model: model,
    schema: z.object({
      title: z.string().describe("The title of the quiz."),
      questions: z.array(
        z.object({
          question_type: z
            .enum([
              "multiple_choice",
              "true_false",
              "short_answer",
              "long_answer",
            ])
            .describe(
              "The type of question. there are four types of questions: multiple_choice, true_false, short_answer, long_answer."
            ),
          question: z
            .string()
            .describe("The content of the question to display."),
          options: z
            .array(z.string())
            .optional()
            .describe(
              "The options for the multiple choice question. This field is only required for multiple_choice questions."
            ),

          correct_answer: z
            .string()
            .describe(
              "The correct answer to the question, in case of multiple_choice provide the index of the correct answer and in case of true_false provide true or false."
            ),
          instructionsForChecking: z
            .string()
            .optional()
            .describe(
              "The instructions for checking the answer, only required for short_answer and long_answer questions."
            ),
        })
      ),
    }),
    prompt: `You are a exam builder AI. You are tasked with creating a quiz for students. You have been given the following instructions: ${instructions}
    
    Context:
    ${joinedPageContents}

    Use only the context that is relevant to the topic provided in the instructions.`,
  });

  const quizId = nanoid();

  await db.insert(quizzesTable).values({
    courseId,
    id: quizId,
    name: res.object.title,
  });

  await db.insert(quizQuestionsTable).values(
    res.object.questions.map((q, i) => ({
      quizId,
      correctAnswer: q.correct_answer,
      instructionsForChecking: q.instructionsForChecking,
      options: q.options?.join("@@@"),
      questionType: q.question_type,
      question: q.question,
      index: i,
    }))
  );

  return quizId;
};
