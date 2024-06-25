import { PrismaCorrespondencesRepository } from "../../repositories/prisma/prisma-correspondences-repository";
import { ReceiveUseCase } from "../receive";

export function makeReceiveUseCase() {
  const correspondencesRepository = new PrismaCorrespondencesRepository();
  const receiveUseCase = new ReceiveUseCase(correspondencesRepository);

  return receiveUseCase;
}
