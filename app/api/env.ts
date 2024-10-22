import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string().url(),
  REDIS_URL: z.string(),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_PASS: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables.", _env.error);

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
