import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "@/db";
import { teachersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const teacherSignInHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { email, password } = req.body as { email: string; password: string };

  const [teacher] = await db
    .select()
    .from(teachersTable)
    .where(eq(teachersTable.email, email))
    .execute();

  if (!teacher || !bcrypt.compareSync(password, teacher.password)) {
    res.status(401).send({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: teacher.id,
      role: "teacher",
    },
    process.env.JWT_SECRET!
  );

  res.send({
    success: true,
    token,
  });
};
