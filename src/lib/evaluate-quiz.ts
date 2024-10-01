import { quizQuestionsTable } from "@/db/schema";
import { generateObject } from "ai";
import { model } from "./llm";
import { z } from "zod";

export const evaluateQuiz = async (
  questions: (typeof quizQuestionsTable.$inferSelect)[],
  answers: string[]
) => {
  const result: {
    id: string;
    isCorrect: boolean;
    correctAnswer: string;
    feedback: string;
    marks: number;
  }[] = [];

  const prompt = `You are a quiz evaluator. You have been given a set of questions and answers. You need to evaluate the answers and provide feedback. Here are the questions and answers:
    
    ${questions
      .map(
        (question, index) => `Question ${index + 1}
      Question: ${question.question}
      Question Type: ${question.questionType}
      ${
        question.options
          ? `Options: ${question.options
              .split("@@@")
              .map((v, i) => `${i + 1}. ${v}`)
              .join("\n")}`
          : ""
      }
      Correct Answer: ${question.correctAnswer}
      Given Answer: ${answers[index]}
      ${
        question.instructionsForChecking
          ? `Instructions for checking: ${question.instructionsForChecking}`
          : ""
      }
      -----------------------------------------`
      )
      .join("\n")}`;

  const res = await generateObject({
    model: model,
    prompt: prompt,
    schema: z.object({
      evaluation: z.array(
        z.object({
          marks: z
            .number()
            .describe(
              "Evaluation marks, maximium marks for MCQ or True/False is 1, for short answer is 2 and for long answer is 5"
            ),
          feedback: z.string().optional().describe("Feedback for the answer"),
          isCorrect: z.boolean().describe("Is the answer correct or not"),
        }),
        {
          description:
            "Evaluation of the answers, please make sure the order of the answers is same as the order of the questions",
        }
      ),
    }),
  });

  return res.object.evaluation;
};
