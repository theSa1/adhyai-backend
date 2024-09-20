import "dotenv/config";
import { vectorStore } from "./lib/vector-store";
import * as path from "path";
import * as fs from "fs";
import { processDoc } from "./lib/process-doc";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { llm } from "./lib/llm";
import { startApi } from "./api";

startApi();

// const retriever = vectorStore.asRetriever();
// const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// const ragChain = await createStuffDocumentsChain({
//   llm,
//   prompt,
//   outputParser: new StringOutputParser(),
// });

// const q = "unit 5 name";

// const retrievedDocs = await retriever.invoke(q);

// console.log(JSON.stringify(retrievedDocs, null, 2));

// const res = await ragChain.invoke({
//   question: q,
//   context: retrievedDocs,
// });

// console.log(JSON.stringify(res, null, 2));
