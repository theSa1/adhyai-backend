import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embeddings";

export const vectorStore = new Chroma(embeddings, {
  collectionName: "ai-lms",
  url: "http://localhost:8000",
});

export const verctorRetriever = vectorStore.asRetriever();
