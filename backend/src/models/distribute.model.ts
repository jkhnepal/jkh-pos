import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";

export interface DistributeInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  stock: number;
}

export interface DistributeDocument extends DistributeInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const distributeSchema = new mongoose.Schema(
  {
    distributeId: {
      type: String,
      required: true,
      unique: true,
      default: () => `distribute_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    stock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const DistributeModel = mongoose.model<DistributeDocument>("Distribute", distributeSchema);

export default DistributeModel;
