import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createMistral } from "@ai-sdk/mistral";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

console.log("Mistral API Key", process.env.MISTRAL_API_KEY);

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY!,
});

// export const model = google("gemini-1.5-pro");
export const model = mistral("open-mistral-nemo");
