import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface TypeInput {
  name: string;
  image?: string;
  description?: string;
}

export interface TypeDocument extends TypeInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const typeSchema = new mongoose.Schema(
  {
    typeId: {
      type: String,
      required: true,
      unique: true,
      default: () => `type_${nanoid()}`,
    },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const TypeModel = mongoose.model<TypeDocument>("Type", typeSchema);

export default TypeModel;
