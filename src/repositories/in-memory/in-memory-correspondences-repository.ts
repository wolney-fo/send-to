import { CorrespondencesRepository } from "../correspondences-repository";
import { Correspondences, Prisma } from "@prisma/client";
import { compare } from "bcryptjs";

export class InMemoryCorrespondencesRepository
  implements CorrespondencesRepository
{
  public items: Correspondences[] = [];

  async findRecentClones(
    content: string,
    type: string,
    one_time_password: string,
    time_to_live: number
  ) {
    const clones = this.items.filter(
      (item) =>
        item.content === content &&
        item.type === type &&
        item.time_to_live === time_to_live
    );

    if (clones.length === 0) {
      return null;
    }

    const recentClone = clones.reduce((latest, current) => {
      return latest.created_at > current.created_at ? latest : current;
    });

    if (await compare(one_time_password, recentClone.one_time_password_hash)) {
      return recentClone;
    }

    return null;
  }

  async getLatestByType(type: "url" | "text") {
    const sameTypeCorrespondences = this.items.filter(
      (item) => item.type === type
    );

    if (sameTypeCorrespondences.length === 0) {
      return null;
    }

    const latestCorrespondence = sameTypeCorrespondences.reduce((latest, current) => {
      return latest.created_at > current.created_at ? latest : current;
    });

    if (!latestCorrespondence) {
      return null;
    }

    return latestCorrespondence;
  }

  async create(data: Prisma.CorrespondencesCreateInput) {
    const correspondence = {
      content: data.content,
      type: data.type,
      one_time_password_hash: data.one_time_password_hash,
      time_to_live: data.time_to_live,
      created_at: new Date(),
    };

    this.items.push(correspondence);

    return correspondence;
  }
}
