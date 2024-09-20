import { db } from "@/db";
import { courseUnitsTable, documentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const bodySchema = z.object({
  unitId: z.number().int(),
  title: z.string(),
});

export const teacherDocumentCreateHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { title, unitId } = bodySchema.parse(req.body);

  const [unit] = await db
    .select()
    .from(courseUnitsTable)
    .where(eq(courseUnitsTable.id, unitId))
    .execute();

  if (!unit) {
    res.status(404).send({
      success: false,
      message: "Unit not found",
    });
    return;
  }

  const [document] = await db
    .insert(documentsTable)
    .values({
      content: "",
      title,
      unitId: unit.id,
    })
    .returning()
    .execute();

  res.send({
    success: true,
    data: {
      id: document.id,
      title: document.title,
    },
  });
};
