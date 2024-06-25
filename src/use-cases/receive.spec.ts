import { InMemoryCorrespondencesRepository } from "../repositories/in-memory/in-memory-correspondences-repository";
import { ExpiredCorrespondenceError } from "./errors/expired-correspondence-error";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { describe, beforeEach, expect, it, vi, afterEach } from "vitest";
import { ReceiveUseCase } from "./receive";
import { compare, hash } from "bcryptjs";

let correspondencesRepository: InMemoryCorrespondencesRepository;
let sut: ReceiveUseCase;

describe("Receive Use Case", () => {
  beforeEach(() => {
    correspondencesRepository = new InMemoryCorrespondencesRepository();
    sut = new ReceiveUseCase(correspondencesRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to receive a text correspondence", async () => {
    await correspondencesRepository.create({
      content: "Content",
      type: "text",
      one_time_password_hash: await hash("123", 6),
      time_to_live: 5,
    });

    await correspondencesRepository.create({
      content: "https://wolney.dev/",
      type: "url",
      one_time_password_hash: await hash("123", 6),
      time_to_live: 5,
    });

    const { correspondence } = await sut.execute({
      one_time_password: "123",
      type: "text",
    });

    expect(correspondence.content).toEqual("Content");
  });

  it("should be able to receive an url correspondence", async () => {
    await correspondencesRepository.create({
      content: "https://wolney.dev/",
      type: "url",
      one_time_password_hash: await hash("123", 6),
      time_to_live: 5,
    });

    await correspondencesRepository.create({
      content: "Content",
      type: "text",
      one_time_password_hash: await hash("123", 6),
      time_to_live: 5,
    });

    const { correspondence } = await sut.execute({
      one_time_password: "123",
      type: "url",
    });

    expect(correspondence.content).toEqual("https://wolney.dev/");
  });

  it("should not be able to receive an expired correspondence", async () => {
    vi.setSystemTime(new Date(2000, 0, 20, 8, 0, 0));

    await correspondencesRepository.create({
      content: "Content",
      type: "text",
      one_time_password_hash: await hash("123", 6),
      time_to_live: 5,
    });

    const SIX_MINUTES = 1000 * 60 * 6;

    vi.advanceTimersByTime(SIX_MINUTES);

    await expect(() =>
      sut.execute({
        one_time_password: "123",
        type: "text",
      })
    ).rejects.toBeInstanceOf(ExpiredCorrespondenceError);
  });

  it("should not be able to receive a correspondence with invalid credentials", async () => {
    await correspondencesRepository.create({
      content: "Content",
      type: "text",
      one_time_password_hash: await hash("123", 6),
      time_to_live: 5,
    });

    await expect(() =>
      sut.execute({
        one_time_password: "321",
        type: "text",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
