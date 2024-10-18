import { z } from "zod";

const thirtyMinutesInSeconds = 60 * 30;

export const composeCorrespondenceFormSchema = z.object({
  content: z
    .string()
    .min(1, { message: "A correspondence must have a content." }),
  time_to_live: z
    .number()
    .min(60, { message: "TTL too short." })
    .max(thirtyMinutesInSeconds, { message: "TTL too long." }),
});

export type ComposeCorrespondenceFormSchema = z.infer<
  typeof composeCorrespondenceFormSchema
>;
