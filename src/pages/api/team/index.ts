import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@/src/pages/api/middlewares/authMiddleware";
import { TeamDTO } from "@/src/pages/api/team/dto/team.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ObjectId } from "mongodb";
import { TeamRepository } from "@/src/pages/api/team/repository/team.repository";
import { TeamPaginationDTO } from "@/src/pages/api/team/dto/team-pagination.dto";
const teamRepository = new TeamRepository();

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    return getList(req, res);
  } else if (req.method === "POST") {
    return createTeam(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);

async function getList(_req: NextApiRequest, res: NextApiResponse) {
  const userId = new ObjectId(_req["user"]["id"]);
  const queryObject = plainToInstance(TeamPaginationDTO, _req.query);
  const teamPagination = Object.assign(new TeamPaginationDTO(), queryObject);
  const errors = await validate(teamPagination);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const teams = await teamRepository.getPagination({
    ...teamPagination,
    userId,
  });

  return res.status(200).json(teams);
}

async function createTeam(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const createTeamDto = Object.assign(new TeamDTO(), _req.body);
    const errors = await validate(createTeamDto);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    createTeamDto.userId = _req["user"]["id"];

    const team = await teamRepository.create(createTeamDto);
    return res.status(201).json({ team });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
