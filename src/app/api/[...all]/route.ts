import { generateId } from '@/lib/generate-id'
import { redis } from '@/lib/redis'
import { cors } from '@elysia/cors'
import { openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia({ prefix: '/api' })
  .use(
    openapi({
      path: '/docs',
    }),
  )
  .use(cors())
  .get(
    '/contents/:contentId',
    async ({ params, set }) => {
      const { contentId } = params

      const content = await redis.get(contentId)

      if (!content) {
        set.status = 404

        return {
          error: "The content either doesn't exist or has expired.",
        }
      }

      return {
        content,
      }
    },
    {
      detail: {
        summary: 'Get content',
        description:
          'Retrieves the plain text content associated with a short URL ID.',
      },
      params: z.object({
        contentId: z.string().min(4),
      }),
      response: {
        200: z.object({
          content: z.string().nonempty(),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
  )
  .post(
    '/contents',
    async ({ body }) => {
      const { content } = body

      const nextId = await redis.incr('content:id:counter')
      const contentId = generateId(nextId)

      await redis.set(contentId, content, 'EX', 60 * 30) // 30 minutes in seconds

      return {
        contentId,
      }
    },
    {
      detail: {
        summary: 'Create content',
        description:
          'Stores plain text content and returns a compact, alphanumeric short URL ID for it, allowing quick transfer of text between devices.',
      },
      body: z.object({
        content: z.string().min(1),
      }),
      response: {
        201: z.object({
          contentId: z.string().nonempty(),
        }),
      },
    },
  )

export const GET = app.fetch
export const POST = app.fetch
