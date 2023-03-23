class Spirit {
  front_default: string;
  back_default: string;
}

class Ability {
  name: string;
  url: string;
}

class Abilities {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

class Type {
  name: string;
  url: string;
}

class Types {
  slot: number;
  type: Type;
}

export class PokemonApiDTO {
  abilities: Abilities[];
  base_experience: number;
  name: string;
  sprites: Spirit;

  types: Types[];
}
