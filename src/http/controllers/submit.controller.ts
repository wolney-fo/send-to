import { makeSubmitUseCase } from "../../use-cases/factories/make-submit-use-case";
import { RecentCloneError } from "../../use-cases/errors/recent-clone";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function submit(request: FastifyRequest, reply: FastifyReply) {
  const submitBodySchema = z.object({
    content: z.string(),
    type: z.enum(["url", "text"]).default("text"),
    one_time_password: z.string(),
    time_to_live: z.number().default(15),
  });

  const { content, type, one_time_password, time_to_live } =
    submitBodySchema.parse(request.body);

  try {
    const submitUseCase = makeSubmitUseCase();

    await submitUseCase.execute({
      content,
      type,
      one_time_password,
      time_to_live,
    });
  } catch (err) {
    if (err instanceof RecentCloneError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
