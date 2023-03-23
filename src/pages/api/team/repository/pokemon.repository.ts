import BaseRepository from "@/src/pages/api/common/repository/base.repository";
import Database from "@/src/pages/api/common/database";
import { Pokemon } from "@/src/pages/api/common/models/pokemon.model";

const instance = Database.getInstance();

export class PokemonRepository extends BaseRepository<Pokemon> {
  constructor() {
    super(instance.getModel("Pokemon"));
  }
}
