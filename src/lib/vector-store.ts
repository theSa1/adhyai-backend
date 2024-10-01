import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embeddings";
import { Comparison, Comparator } from "langchain/chains/query_constructor/ir";

export const vectorStore = new Chroma(embeddings, {
  collectionName: "ai-lms",
  url: "http://localhost:8000",
});

export const verctorRetriever = vectorStore.asRetriever;

export const getRetriever = (courseId: string) => {
  return vectorStore.asRetriever({
    filter: {
      courseId: courseId,
    },
  });
};
