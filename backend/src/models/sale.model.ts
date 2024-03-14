import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";
import { MemberDocument } from "./member.model";

// it track the stock giben to branches
export interface SaleInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  member: MemberDocument["_id"];

  quantity: number;
  discount: number; // in %
  sp: number;
}

export interface SaleDocument extends SaleInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new mongoose.Schema(
  {
    saleId: {
      type: String,
      required: true,
      unique: true,
      default: () => `sale_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },

    quantity: { type: Number, required: true },
    discount: { type: Number, required: true },
    sp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SaleModel = mongoose.model<SaleDocument>("Sale", saleSchema);

export default SaleModel;
