import { NextResponse } from "next/server";
import { redis } from "../../lib/redis";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Correspondence not found." },
      { status: 400 }
    );
  }

  const content = await redis.get(id);

  if (!content) {
    return NextResponse.json(
      { error: "Correspondence not found." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: `Correspondence ${id} received.`, data: { content } },
    { status: 200 }
  );
}
