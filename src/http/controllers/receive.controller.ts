import { makeReceiveUseCase } from "../../use-cases/factories/make-receive-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function receive(request: FastifyRequest, reply: FastifyReply) {
  const receiveHeaderSchema = z.object({
    one_time_password: z.string(),
    type: z.enum(["url", "text"]),
  });

  const { one_time_password, type } = receiveHeaderSchema.parse(
    request.headers
  );

  const receiveUseCase = makeReceiveUseCase();

  const { correspondence } = await receiveUseCase.execute({
    one_time_password,
    type,
  });

  return reply.status(200).send({
    correspondence,
  });
}
