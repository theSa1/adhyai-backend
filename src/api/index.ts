import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import * as jwt from "jsonwebtoken";
import { JWTPayload } from "@/types";
import { studentSignInHandler } from "@/api/student/auth/sign-in";
import { studentSignUpHandler } from "@/api/student/auth/sign-up";
import { teacherSignInHandler } from "@/api/teacher/auth/sign-in";
import { teacherSignUpHandler } from "@/api/teacher/auth/sign-up";
import { teacherCourseListHandler } from "./teacher/course/list";
import { teacherCourseCreateHandler } from "./teacher/course/create";
import { teacherCourseGetHandler } from "./teacher/course/get";
import { teacherCourseUnitCreateHandler } from "./teacher/course/unit/create";
import { teacherDocumentCreateHandler } from "./teacher/course/document/create";
import { teacherDocumentGetHandler } from "./teacher/course/document/get";
import { teacherDocumentUpdateHandler } from "./teacher/course/document/update";
import cors from "@fastify/cors";
import { documentUploadHandler } from "./document/upload";

const fastify = Fastify({
  // logger: true,
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

fastify.post("/student/sign-in", studentSignInHandler);
fastify.post("/student/sign-up", studentSignUpHandler);

fastify.post("/teacher/sign-in", teacherSignInHandler);
fastify.post("/teacher/sign-up", teacherSignUpHandler);

fastify.get(
  "/teacher/course/list",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherCourseListHandler
);
fastify.post(
  "/teacher/course/create",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherCourseCreateHandler
);
fastify.get(
  "/teacher/course/:id",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherCourseGetHandler
);
fastify.post(
  "/teacher/course/unit/create",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherCourseUnitCreateHandler
);
fastify.post(
  "/teacher/course/document/create",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherDocumentCreateHandler
);
fastify.get(
  "/teacher/course/document/:id",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherDocumentGetHandler
);
fastify.post(
  "/teacher/course/document/update",
  {
    preHandler: fastify.teacherOnly,
  },
  teacherDocumentUpdateHandler
);

fastify.post("/document/upload", documentUploadHandler);

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
