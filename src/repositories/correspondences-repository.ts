import { Prisma, Correspondences } from "@prisma/client";

export interface CorrespondencesRepository {
  findRecentClones(
    content: string,
    type: string,
    one_time_password: string,
    time_to_live: number
  ): Promise<Correspondences | null>;
  create(data: Prisma.CorrespondencesCreateInput): Promise<Correspondences>;
}
