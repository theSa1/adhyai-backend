import type { FastifyRequest, FastifyReply } from "fastify";

export type JWTPayload = {
  userId: string;
};

declare module "fastify" {
  interface FastifyRequest {
    user?: JWTPayload;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
