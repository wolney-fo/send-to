import { PrismaCorrespondencesRepository } from "../../repositories/prisma/prisma-correspondences-repository";
import { SubmitUseCase } from "../submit";

export function makeSubmitUseCase() {
  const correspondencesRepository = new PrismaCorrespondencesRepository();
  const submitUseCase = new SubmitUseCase(correspondencesRepository);

  return submitUseCase;
}
