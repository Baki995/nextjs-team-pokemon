import { Schema, model, Document } from "mongoose";

interface Ability {
  name: string;
}

interface Type {
  name: string;
}

const abilitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const typeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export interface Pokemon extends Document {
  name: string;
  baseExperience: number;
  sprite: string;
  teamId: string;
  abilities: Ability[];
  types: Type[];
}

export const pokemonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    baseExperience: {
      type: Number,
      required: true,
    },
    sprite: {
      type: String,
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    abilities: {
      type: [abilitySchema],
      required: true,
    },
    types: {
      type: [typeSchema],
      required: true,
    },
  },
  { collection: "pokemons", autoCreate: true, timestamps: true, strict: false }
);
