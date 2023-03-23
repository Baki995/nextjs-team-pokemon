import BaseRepository from "@/src/pages/api/common/repository/base.repository";
import Database from "@/src/pages/api/common/database";
import { Team } from "@/src/pages/api/common/models/team.model";
import { Document, FilterQuery } from "mongoose";
import { TeamPaginationDTO } from "@/src/pages/api/team/dto/team-pagination.dto";

const instance = Database.getInstance();

export class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super(instance.getModel("Team"));
  }

  async getPagination(options: TeamPaginationDTO) {
    const whereTypes = {};

    const skip = (options.page - 1) * options.perPage;

    if (options.type) {
      whereTypes["pokemons.types.name"] = options.type;
    }

    const data = await this.model
      .aggregate()
      .match({ userId: options.userId })
      .lookup({
        from: "pokemons",
        localField: "_id",
        foreignField: "teamId",
        as: "pokemons",
      })
      .match(whereTypes)
      .addFields({
        totalBaseExperience: {
          $reduce: {
            input: "$pokemons",
            initialValue: 0,
            in: {
              $add: ["$$value", "$$this.baseExperience"],
            },
          },
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(options.perPage)
      .project({
        name: 1,
        totalBaseExperience: 1,
        "pokemons.sprite": 1,
        "pokemons._id": 1,
        "pokemons.types": 1,
        createdAt: 1,
      });

    const totalData = await this.model
      .aggregate()
      .match({ userId: options.userId })
      .lookup({
        from: "pokemons",
        localField: "_id",
        foreignField: "teamId",
        as: "pokemons",
      })
      .match(whereTypes)
      .count("totalData");

    const metadata = {
      perPage: options.perPage,
      currentPage: options.page,
      totalData: totalData[0]["totalData"],
      hasNextPage: totalData[0]["totalData"] > skip + data.length,
    };

    return { data, metadata };
  }

  async findOneWIthPokemons(filter: FilterQuery<Document>) {
    const result = await this.model.aggregate().match(filter).lookup({
      from: "pokemons",
      localField: "_id",
      foreignField: "teamId",
      as: "pokemons",
    });

    return result[0];
  }
}
