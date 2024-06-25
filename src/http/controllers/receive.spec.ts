import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../lib/prisma";
import { hash } from "bcryptjs";

describe("Receive (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to receive a text correspondence", async () => {
    await prisma.correspondences.create({
      data: {
        content: "Text to send",
        type: "text",
        one_time_password_hash: await hash("123", 6),
        time_to_live: 5,
      },
    });

    const response = await request(app.server)
      .get("/copy-it")
      .set("one_time_password", "123")
      .set("type", "text")
      .send();

    expect(response.statusCode).toEqual(200);
  });

  it("Should be able to receive an url correspondence", async () => {
    await prisma.correspondences.create({
      data: {
        content: "https://wolney.dev/",
        type: "url",
        one_time_password_hash: await hash("123", 6),
        time_to_live: 5,
      },
    });

    const response = await request(app.server)
      .get("/open-it")
      .set("one_time_password", "123")
      .set("type", "url")
      .send();

    expect(response.statusCode).toEqual(200);
  });
});
