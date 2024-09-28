import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";
import cors from "@fastify/cors";
import { documentUploadHandler } from "./document/upload";
import { sendChatMessageHandler } from "./chat/send";

const fastify = Fastify({
  // logger: true,
  bodyLimit: 1024 * 1024 * 100,
});

fastify.register(cors, {
  origin: "*",
});

fastify.addHook("preHandler", (request, reply, done) => {
  const token = request.headers["authorization"]?.replace("Bearer ", "");

  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      request.user = user;
    } catch (err) {}
  }

  done();
});
fastify.decorate(
  "teacherOnly",
  async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== "teacher") {
      reply.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }
  }
);
fastify.decorate(
  "studentOnly",
  async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== "student") {
      reply.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }
  }
);

fastify.get(
  "/",
  { preHandler: fastify.studentOnly },
  async (request, reply) => {
    return { hello: "world" };
  }
);

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      success: false,
      message: error.errors[0].message ?? "Invalid request",
    });
  } else if (error instanceof Error) {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  } else {
    console.error(error);
    reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});

fastify.post("/document/upload", documentUploadHandler);

fastify.post("/chat/send", sendChatMessageHandler);

export const startApi = async () => {
  try {
    await fastify.listen({
      port: 3000,
      host: "0.0.0.0",
    });
    console.log("API server is running");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
