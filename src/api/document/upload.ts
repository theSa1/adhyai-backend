import { db } from "@/db";
import { documentsTable } from "@/db/schema";
import { processDoc } from "@/lib/process-doc";
import { FastifyReply, FastifyRequest } from "fastify";
import { nanoid } from "nanoid";
import { z } from "zod";

export const bodySchama = z.object({
  name: z.string(),
  content: z.string(),
  courseId: z.string(),
});

export const documentUploadHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { name, content, courseId } = bodySchama.parse(req.body);

  const [mime, data] = content.split("base64,");
  const buffer = Buffer.from(data, "base64");

  if (mime !== "data:application/pdf;") {
    res.status(400).send({
      success: false,
      message: "Only PDF files are supported",
    });
  }

  const id = nanoid();

  await db
    .insert(documentsTable)
    .values({
      id,
      name,
      courseId,
    })
    .execute();

  await processDoc(new Blob([buffer]), name, {
    id,
    userId: req.user?.userId,
    courseId,
  });

  res.send({ name, content });
};
