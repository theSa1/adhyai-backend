import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { mistral } from "@ai-sdk/mistral";

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});
export const model = google("gemini-1.5-pro");
