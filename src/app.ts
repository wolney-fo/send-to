import fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { ResourceNotFoundError } from "./use-cases/errors/resource-not-found-error";
import { RecentCloneError } from "./use-cases/errors/recent-clone";
import { InvalidCredentialsError } from "./use-cases/errors/invalid-credentials-error";
import { ExpiredCorrespondenceError } from "./use-cases/errors/expired-correspondence-error";

export const app = fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization", "one_time_password"],
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(401).send({ message: "Unauthorized." });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: "Resource not found." });
  }

  if (error instanceof RecentCloneError) {
    return reply.status(409).send({ message: "Correspondence sent recently." });
  }

  if (error instanceof ExpiredCorrespondenceError) {
    return reply.status(410).send({ message: "Expired correspondence." });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: implement log tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
