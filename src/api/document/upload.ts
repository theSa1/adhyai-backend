import { processDoc } from "@/lib/process-doc";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const bodySchama = z.object({
  name: z.string(),
  content: z.string(),
});

export const documentUploadHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { name, content } = bodySchama.parse(req.body);

  const [mime, data] = content.split("base64,");
  const buffer = Buffer.from(data, "base64");

  await processDoc(new Blob([buffer]), name, {});

  res.send({ name, content });
};
