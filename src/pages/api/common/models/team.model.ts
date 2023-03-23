import { Schema, model, Document } from "mongoose";

export interface Team extends Document {
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const teamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "teams", autoCreate: true, timestamps: true, strict: false }
);
