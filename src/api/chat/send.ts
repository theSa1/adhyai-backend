import { model } from "@/lib/llm";
import { verctorRetriever } from "@/lib/vector-store";
import { convertToCoreMessages, Message, streamText, tool } from "ai";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const SYSTEM_PROMPT = `You are a helpful student companion called AdhyAI that helps students prepare for the exams. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know.`;

export const sendChatMessageHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { messages } = req.body as {
    messages: Message[];
  };
  console.log(JSON.stringify(req.body, null, 2));

  const result = await streamText({
    model: model,
    system: SYSTEM_PROMPT,
    messages: convertToCoreMessages(messages),
    tools: {
      getInformation: tool({
        description: `get extra information on the topic provided, the information may be not relevant to the question, if that is the case, please respond with "Sorry, I don't know" and only answer with relevant information.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => {
          console.log("Adding resource to knowledge base", question);
          const retrievedDocs = await verctorRetriever.invoke(question);
          const joinedPageContents = retrievedDocs
            .map((doc) => doc.pageContent)
            .join("\n\n");

          return {
            context: joinedPageContents,
          };
        },
      }),

      startQuiz: tool({
        description: `Start a quiz for the user, based on the topic provided, The quiz will start on an external platform, so please respond with message like the quiz has started.`,
        parameters: z.object({
          context: z.string().describe("detailed context of the quiz"),
        }),
        execute: async ({ context }) => {
          console.log("Starting quiz for subject", context);
          return {
            context: `Starting quiz for ${context}`,
          };
        },
      }),
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
};
