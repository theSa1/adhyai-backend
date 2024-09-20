import type { FastifyRequest, FastifyReply } from "fastify";

export type JWTPayload = {
  userId: number;
  role: "teacher" | "student";
};

declare module "fastify" {
  interface FastifyRequest {
    user?: JWTPayload;
  }
  interface FastifyInstance {
    teacherOnly: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    studentOnly: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
