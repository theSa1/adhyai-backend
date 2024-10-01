import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";
import cors from "@fastify/cors";
import { documentUploadHandler } from "./document/upload";
import { sendChatMessageHandler } from "./chat/send";
import { getQuizHandler } from "./quiz/get";
import { getAllQuizzesHandler } from "./quiz/get-all";
import { getCoursesHandler } from "./course/get";
import { addCourseHandler } from "./course/add";
import { submitQuizHandler } from "./quiz/submit";
import { documentListGetHandler } from "./document/get";
import { clerkPlugin } from "@clerk/fastify";

const fastify = Fastify({
  // logger: true,
  bodyLimit: 1024 * 1024 * 100,
});

fastify.register(cors, {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://adhyai.sa1.dev",
  ],
  credentials: true,
});

fastify.register(clerkPlugin);

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
  "requireAuth",
  async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user.userId) {
      reply.status(403).send({
        success: false,
        message: "Forbidden",
      });
    }
  }
);

fastify.get(
  "/",
  { preHandler: fastify.requireAuth },
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
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  } else {
    reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});

fastify.post("/document/upload", documentUploadHandler);
fastify.get("/document/get", documentListGetHandler);

fastify.post("/chat/send", sendChatMessageHandler);

fastify.get("/course/get", getCoursesHandler);
fastify.post("/course/add", addCourseHandler);

fastify.get("/quiz/get", getQuizHandler);
fastify.get("/quiz/get-all", getAllQuizzesHandler);
fastify.post("/quiz/submit", submitQuizHandler);

export const startApi = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await fastify.listen({
      port: port,
      host: "0.0.0.0",
    });
    console.log("Server running at port", port);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
