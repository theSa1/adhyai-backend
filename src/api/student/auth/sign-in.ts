import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/db";
import { z } from "zod";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const studentSignInHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { email, password } = bodySchema.parse(req.body);

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .execute();

  if (!user) {
    res.status(401).send({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401).send({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: "student" } as JWTPayload,
    process.env.JWT_SECRET!
  );

  res.send({
    success: true,
    token,
  });
};
