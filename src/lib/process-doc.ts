import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { vectorStore } from "./vector-store";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";

export const processDoc = async (
  doc: Blob,
  filename: string,
  metadata: {
    [key: string]: any;
  }
) => {
  const allDocs: Document<Record<string, any>>[] = [];
  let docs: Document<Record<string, any>>[] = [];
  if (filename.endsWith(".txt") || filename.endsWith(".md")) {
    const loader = new TextLoader(doc);
    docs = await loader.load();
  } else if (filename.endsWith(".pdf")) {
    const loader = new PDFLoader(doc);
    docs = await loader.load();
  }

  console.log(filename);
  console.log(
    docs
      .map((c) => c.pageContent)
      .join("\n-----------------------------------------\n")
  );
  console.log("-------------------------------------------------");

  docs.forEach((d, i) => {
    d.metadata = {
      ...metadata,
      filename,
      chunkId: i,
    };
    allDocs.push(d);
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.splitDocuments(allDocs);

  const res = await vectorStore.addDocuments(chunks);

  console.log(res);
};
