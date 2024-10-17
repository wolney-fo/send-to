import { z } from "zod";

export const receiveParamsSchema = z.object({
  correspondenceId: z.string().length(6),
});

export type ReceiveParamsSchema = z.infer<typeof receiveParamsSchema>;
