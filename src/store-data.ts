import path from "path";
import fs from "fs";
import { processDoc } from "./lib/process-doc";

const docsPath = path.join(__dirname, "..", "docs");

const files = fs.readdirSync(docsPath);

for (const file of files) {
  const filePath = path.join(docsPath, file);
  const doc = fs.readFileSync(filePath);
  await processDoc(new Blob([doc]), file, {
    subject: "ADC",
  });
  console.log("a file processed");
}

console.log("done");
