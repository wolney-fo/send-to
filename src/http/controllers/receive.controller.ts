import { makeReceiveUseCase } from "../../use-cases/factories/make-receive-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function receive(request: FastifyRequest, reply: FastifyReply) {
  const receiveParamsSchema = z.object({
    type: z.enum(["url", "text"]),
  });

  const receiveHeaderSchema = z.object({
    one_time_password: z.string(),
  });

  const { type } = receiveParamsSchema.parse(request.params);

  const { one_time_password } = receiveHeaderSchema.parse(request.headers);

  const receiveUseCase = makeReceiveUseCase();

  const { content } = await receiveUseCase.execute({
    one_time_password,
    type,
  });

  return reply.status(200).send({
    content,
  });
}
