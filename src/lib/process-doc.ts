import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { vectorStore } from "./vector-store";
import { model } from "./llm";
import { generateText } from "ai";

export const processDoc = async (
  doc: Blob,
  filename: string,
  metadata: {
    [key: string]: any;
  }
) => {
  let docs: Document<Record<string, any>>[] = [];
  if (filename.endsWith(".txt") || filename.endsWith(".md")) {
    const loader = new TextLoader(doc);
    docs = await loader.load();
  } else if (filename.endsWith(".pdf")) {
    const loader = new PDFLoader(doc);
    docs = await loader.load();
  }

  const prompt = `You are an assistant responsible for refining and organizing raw text extracted from documents. This raw text may contain irrelevant or incorrectly detected information, which you can remove as needed. Your task is to ensure that the content is properly structured, including accurate formatting of tables and other elements.
    
Raw Text: ${docs.map((doc) => doc.pageContent).join("\n\n")}`;

  const retrievalSummary = await generateText({
    model: model,
    prompt: prompt,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.splitText(retrievalSummary.text);

  const res = await vectorStore.addDocuments(
    chunks.map(
      (chunk) =>
        new Document({
          pageContent: chunk,
          metadata: {
            ...metadata,
            filename,
          },
        })
    )
  );
};
