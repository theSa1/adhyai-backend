import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "models/embedding-001",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
});
