import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { redis } from "../lib/redis";
import { composeBodySchema } from "../schemas/compose-body-schema";
import { generateCompactID } from "../utils/unique-id";
import { env } from "../env";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { content, time_to_live: timeToLive } = composeBodySchema.parse(body);

    const correspondenceCode = generateCompactID();
    const accessUrl = `${env.APP_URL}/${correspondenceCode}`;

    await redis.set(correspondenceCode, content, "EX", timeToLive);

    return NextResponse.json(
      {
        message: "Correspondence created.",
        data: {
          access_url: accessUrl,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Error processing request",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
