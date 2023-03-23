import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { TeamRepository } from "./repository/team.repository";
import { validate } from "class-validator";
import { TeamDTO } from "./dto/team.dto";
import { ObjectId } from "mongodb";
import { authMiddleware } from "@/src/pages/api/middlewares/authMiddleware";

const teamRepository = new TeamRepository();
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    return getById(req, res);
  } else if (req.method === "PUT") {
    return updateTeam(req, res);
  } else if (req.method === "DELETE") {
    return deleteTeam(req, res);
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);

async function getById(_req: NextApiRequest, res: NextApiResponse) {
  const id = new ObjectId(_req.query.id.toString());
  const team = await teamRepository.findOneWIthPokemons({ _id: id });

  if (!team) {
    return res.status(404).json({ message: "Team does not exist " });
  }

  return res.status(200).json(team);
}

async function updateTeam(_req: NextApiRequest, res: NextApiResponse) {
  const id = _req.query.id.toString();
  const team = await teamRepository.findById(id);

  if (!team) {
    res.status(404).json({ message: "Team does not exist " });
  }

  const updateTeamDto = Object.assign(new TeamDTO(), _req.body);
  const errors = await validate(updateTeamDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const updatedTeam = await teamRepository.update(id, updateTeamDto);
  return res.status(201).json({ team: updatedTeam });
}

async function deleteTeam(_req: NextApiRequest, res: NextApiResponse) {
  const id = _req.query.id.toString();
  await teamRepository.delete(id);
  return res.status(200).json({ deleted: true });
}
