import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";

export interface ReturnToHeadquarterInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  returnedQuantity: number;
  branchInventoryId: string;
}

export interface ReturnToHeadquarterDocument extends ReturnToHeadquarterInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const returnToHeadquarterSchema = new mongoose.Schema(
  {
    returnToHeadquarterId: {
      type: String,
      required: true,
      unique: true,
      default: () => `return_to_headquarter_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    returnedQuantity: { type: Number, required: true },
    branchInventoryId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ReturnToHeadquarterModel = mongoose.model<ReturnToHeadquarterDocument>("ReturntoHeadquarter", returnToHeadquarterSchema);

export default ReturnToHeadquarterModel;
