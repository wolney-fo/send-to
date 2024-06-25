import { submit } from "./controllers/submit.controller";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/send-to", submit);
}
