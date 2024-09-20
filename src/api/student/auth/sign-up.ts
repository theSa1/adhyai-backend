import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const studentSignUpHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { name, email, password } = bodySchema.parse(req.body);

  // Check if user with email already exists
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .execute();

  if (user) {
    res.status(400).send({
      success: false,
      message: "User with this email already exists",
    });
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into database
  const [dbUser] = await db
    .insert(usersTable)
    .values({
      email,
      name,
      password: hashedPassword,
    })
    .returning();

  // Generate JWT token
  const token = jwt.sign(
    { userId: dbUser.id, role: "student" } as JWTPayload,
    process.env.JWT_SECRET!
  );

  res.send({
    success: true,
    token,
  });
};
