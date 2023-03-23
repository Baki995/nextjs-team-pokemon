import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "@/src/pages/api/middlewares/authMiddleware";
import { PokemonRepository } from "@/src/pages/api/team/repository/pokemon.repository";
import { TeamRepository } from "@/src/pages/api/team/repository/team.repository";
const pokemonRepository = new PokemonRepository();
const teamRepository = new TeamRepository();

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "DELETE") {
    return deletePokemon(req, res);
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authMiddleware(handler);

async function deletePokemon(_req: NextApiRequest, res: NextApiResponse) {
  const id = _req.query.id.toString();
  const pokemon = await pokemonRepository.findById(id);

  if (!pokemon) {
    return res.status(404).json({ message: "Pokemon does not exist" });
  }

  const team = await teamRepository.findById(pokemon.teamId);
  if (team.userId.toString() !== _req["user"]["id"]) {
    return res.status(403).json({
      message: "Forbidden – you don’t have permission to access this resource",
    });
  }

  await pokemonRepository.delete(id);

  return res.status(200).json({ deleted: true });
}
