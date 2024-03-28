import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface BranchInput {
  name: string;
  email: string;
  phone: number;
  password: string;
  address: string;
  type?: string;
  image?: string;
}

export interface BranchDocument extends BranchInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
      unique: true,
      default: () => `branch_${nanoid()}`,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    type: { type: String, enum: ["headquarter", "branch"], default: "branch" },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const BranchModel = mongoose.model<BranchDocument>("Branch", branchSchema);

export default BranchModel;
