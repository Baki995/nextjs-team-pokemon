import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { PokemonApiDTO } from "../dto/pokemon-api.dto";
import { PokemonRepository } from "@/src/pages/api/team/repository/pokemon.repository";
import { TeamRepository } from "@/src/pages/api/team/repository/team.repository";
const _api = "https://pokeapi.co/api/v2/pokemon/";
const pokemonRepository = new PokemonRepository();
const teamRepository = new TeamRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await addRandomPokemon(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function addRandomPokemon(req: NextApiRequest, res: NextApiResponse) {
  const teamId = req.query.id.toString();
  const team = await teamRepository.findById(teamId);

  if (!team) {
    res.status(404).json({ message: "Team does not exist" });
  }

  const pokemonId = Math.floor(Math.random() * 999) + 1;
  const response = await fetch(`${_api}${pokemonId}`);
  const pokemonResponse = await response.json();
  const pokemon = Object.assign(new PokemonApiDTO(), pokemonResponse);

  const abilities = pokemon.abilities.map((item) => ({
    name: item.ability.name,
  }));

  const types = pokemon.types.map((item) => ({
    name: item.type.name,
  }));

  await pokemonRepository.create({
    teamId,
    name: pokemon.name,
    baseExperience: pokemon.base_experience ?? 0,
    sprite: pokemon.sprites.front_default,
    abilities,
    types,
  });

  res.status(200).json({ success: true });
}
