import { Prisma, Correspondences } from "@prisma/client";

export interface CorrespondencesRepository {
  findRecentClones(
    content: string,
    type: "url" | "text",
    one_time_password: string,
    time_to_live: number
  ): Promise<Correspondences | null>;
  getLatestByType(type: "url" | "text"): Promise<Correspondences | null>;
  create(data: Prisma.CorrespondencesCreateInput): Promise<Correspondences>;
}
