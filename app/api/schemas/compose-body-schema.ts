import { z } from "zod";

export const composeBodySchema = z.object({
  content: z.string().min(1, { message: "Content too short." }),
  time_to_live: z.coerce.number().int().min(1).max(1800),
});

export type ComposeBodySchema = z.infer<typeof composeBodySchema>;
