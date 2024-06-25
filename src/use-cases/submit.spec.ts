import { InMemoryCorrespondencesRepository } from "../repositories/in-memory/in-memory-correspondences-repository";
import { describe, beforeEach, expect, it, vi, afterEach } from "vitest";
import { RecentCloneError } from "./errors/recent-clone";
import { SubmitUseCase } from "./submit";
import { compare } from "bcryptjs";

let correspondencesRepository: InMemoryCorrespondencesRepository;
let sut: SubmitUseCase;

describe("Submit Use Case", () => {
  beforeEach(() => {
    correspondencesRepository = new InMemoryCorrespondencesRepository();
    sut = new SubmitUseCase(correspondencesRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to submit a correspondence", async () => {
    const { correspondence } = await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 5,
    });

    expect(correspondence.content).toEqual("Content");
  });

  it("should hash the OTP when submit a correspondence", async () => {
    const { correspondence } = await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 5,
    });

    const isOTPCorrectlyHashed = await compare(
      "123",
      correspondence.one_time_password_hash
    );

    expect(isOTPCorrectlyHashed).toBe(true);
  });

  it("should not be able to submit a correspondence twice when the first one is alive", async () => {
    await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 15,
    });

    await expect(() =>
      sut.execute({
        content: "Content",
        type: "text",
        one_time_password: "123",
        time_to_live: 15,
      })
    ).rejects.toBeInstanceOf(RecentCloneError);
  });

  it("should be able to submit a correspondence twice if it has differences", async () => {
    vi.setSystemTime(new Date(2000, 0, 20, 8, 0, 0));

    await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 15,
    });

    const SIXTEEN_MINUTES = 1000 * 60 * 16;

    vi.advanceTimersByTime(SIXTEEN_MINUTES);

    const { correspondence } = await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 5,
    });

    expect(correspondence.content).toEqual("Content");
  });

  it("should be able to resend a correspondence when the previous version is dead", async () => {
    vi.setSystemTime(new Date(2000, 0, 20, 8, 0, 0));

    await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 15,
    });

    const SIXTEEN_MINUTES = 1000 * 60 * 16;

    vi.advanceTimersByTime(SIXTEEN_MINUTES);

    const { correspondence } = await sut.execute({
      content: "Content",
      type: "text",
      one_time_password: "123",
      time_to_live: 15,
    });

    expect(correspondence.content).toEqual("Content");
  });
});
