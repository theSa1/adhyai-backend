import { db } from "@/db";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";

const bodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginHandler = async (req: FastifyRequest, res: FastifyReply) => {
  const { email, password } = bodySchema.parse(req.body);

  const user = await db.query.usersTable.findFirst({
    where: (t) => eq(t.email, email),
  });

  const isPasswordCorrect = bcrypt.compareSync(password, user?.password || "");

  if (!user || !isPasswordCorrect) {
    return res.status(401).send({
      success: false,
      message: "User not found",
    });
  }

  const token = jwt.sign(
    { userId: user.id } as JWTPayload,
    process.env.JWT_SECRET || ""
  );

  return res.send({
    success: true,
    token,
  });
};
