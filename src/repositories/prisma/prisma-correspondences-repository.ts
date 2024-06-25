import { CorrespondencesRepository } from "../correspondences-repository";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { compare } from "bcryptjs";

export class PrismaCorrespondencesRepository
  implements CorrespondencesRepository
{
  async findRecentClones(
    content: string,
    type: string,
    one_time_password: string,
    time_to_live: number
  ) {
    const recentClone = await prisma.correspondences.findFirst({
      where: {
        content,
        type,
        time_to_live,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (
      recentClone &&
      (await compare(one_time_password, recentClone.one_time_password_hash))
    ) {
      return recentClone;
    }

    return null;
  }

  async create(data: Prisma.CorrespondencesCreateInput) {
    const correspondence = await prisma.correspondences.create({
      data,
    });

    return correspondence;
  }
}
