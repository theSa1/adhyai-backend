import { model } from "@/lib/llm";
import { startQuiz } from "@/lib/start-quiz";
import { getRetriever, verctorRetriever } from "@/lib/vector-store";
import {
  convertToCoreMessages,
  Message,
  streamText,
  tool,
  StreamData,
} from "ai";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const SYSTEM_PROMPT = `You are a helpful student companion called AdhyAI that helps students prepare for the exams. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know.`;

export const sendChatMessageHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { messages, courseId } = req.body as {
    messages: Message[];
    courseId: string;
  };

  const data = new StreamData();

  const result = await streamText({
    model: model,
    system: SYSTEM_PROMPT,
    messages: convertToCoreMessages(messages),
    tools: {
      get_information: tool({
        description: `get extra information on the topic provided, the information may be not relevant to the question, if that is the case, please respond with "Sorry, I don't know" and only answer with relevant information.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => {
          const retrievedDocs = await getRetriever(courseId).invoke(question);
          const joinedPageContents = retrievedDocs
            .map((doc) => doc.pageContent)
            .join("\n\n");

          return {
            context: joinedPageContents,
          };
        },
      }),

      start_quiz: {
        description:
          "Initialize the quiz with a specified topic and number of questions.",
        parameters: z
          .object({
            instructions: z
              .string()
              .describe("The instructions for the quiz setting AI"),
          })
          .required(),
        execute: async ({ instructions }) => {
          const quiz = await startQuiz(instructions, courseId);

          data.append({
            type: "quiz",
            data: {
              quizId: quiz,
            },
          });

          return {
            context: "Quiz started on an external platform",
          };
        },
      },
    },
    onFinish: () => {
      data.close();
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse({ data });
};
