import { CorrespondencesRepository } from "../repositories/correspondences-repository";
import { RecentCloneError } from "./errors/recent-clone";
import { Correspondences } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import dayjs from "dayjs";

interface SubmitUseCaseRequest {
  content: string;
  type: "url" | "text";
  one_time_password: string;
  time_to_live: number;
}

interface SubmitUseCaseResponse {
  correspondence: Correspondences;
}

export class SubmitUseCase {
  constructor(private correspondencesRepository: CorrespondencesRepository) {}

  async execute({
    content,
    type,
    one_time_password,
    time_to_live,
  }: SubmitUseCaseRequest): Promise<SubmitUseCaseResponse> {
    const one_time_password_hash = await hash(one_time_password, 6);

    const recentClone = await this.correspondencesRepository.findRecentClones(
      content,
      type,
      one_time_password,
      time_to_live
    );

    if (recentClone) {
      const distanceInMinutesFromCorrespondenceSubmit = dayjs(new Date()).diff(
        recentClone?.created_at,
        "minutes"
      );

      if (
        distanceInMinutesFromCorrespondenceSubmit < recentClone.time_to_live
      ) {
        throw new RecentCloneError();
      }
    }

    const correspondence = await this.correspondencesRepository.create({
      content,
      type,
      one_time_password_hash,
      time_to_live,
    });

    return { correspondence };
  }
}
