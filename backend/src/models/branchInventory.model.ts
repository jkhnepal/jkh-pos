import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { ProductDocument } from "./product.model";
import { BranchDocument } from "./branch.model";

export interface BranchInventoryInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  previousStock?: number;
  totalStock: number;
  

}

export interface BranchInventoryDocument extends BranchInventoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const branchInventorySchema = new mongoose.Schema(
  {
    branchInventoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `branch_inventory_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    previousStock: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const BranchInventoryModel = mongoose.model<BranchInventoryDocument>("BranchInventory", branchInventorySchema);

export default BranchInventoryModel;
