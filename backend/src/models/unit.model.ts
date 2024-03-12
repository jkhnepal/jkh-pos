import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface UnitInput {
  name: string;
  shortForm?: string;
}

export interface UnitDocument extends UnitInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const unitSchema = new mongoose.Schema(
  {
    unitId: {
      type: String,
      required: true,
      unique: true,
      default: () => `unit_${nanoid()}`,
    },
    name: { type: String, required: true, unique: true },
    shortForm: { type: String },
  },
  {
    timestamps: true,
  }
);

const UnitModel = mongoose.model<UnitDocument>("Unit", unitSchema);

export default UnitModel;
