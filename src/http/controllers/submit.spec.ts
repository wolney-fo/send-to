import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../app";

describe("Submit (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to submit a correspondence", async () => {
    const response = await request(app.server).post("/send-to").send({
      content: "Text to send",
      type: "text",
      one_time_password: "12345678",
      time_to_live: 5,
    });

    expect(response.statusCode).toEqual(201);
  });
});
