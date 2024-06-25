import { CorrespondencesRepository } from "../repositories/correspondences-repository";
import { ExpiredCorrespondenceError } from "./errors/expired-correspondence-error";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Correspondences } from "@prisma/client";
import { compare } from "bcryptjs";
import dayjs from "dayjs";

interface ReceiveUseCaseRequest {
  one_time_password: string;
  type: "url" | "text";
}

interface ReceiveUseCaseResponse {
  correspondence: Correspondences;
}

export class ReceiveUseCase {
  constructor(private correspondencesRepository: CorrespondencesRepository) {}

  async execute({
    one_time_password,
    type,
  }: ReceiveUseCaseRequest): Promise<ReceiveUseCaseResponse> {
    const correspondence = await this.correspondencesRepository.getLatestByType(
      type
    );

    if (!correspondence) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCorrespondenceSubmit = dayjs(new Date()).diff(
      correspondence.created_at,
      "minutes"
    );

    if (
      distanceInMinutesFromCorrespondenceSubmit > correspondence.time_to_live
    ) {
      throw new ExpiredCorrespondenceError();
    }

    if (
      (await compare(
        one_time_password,
        correspondence.one_time_password_hash
      )) === false
    ) {
      throw new InvalidCredentialsError();
    }
    
    return { correspondence };
  }
}
