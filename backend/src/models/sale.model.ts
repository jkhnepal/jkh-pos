import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";
import { MemberDocument } from "./member.model";

export interface SaleInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  member: MemberDocument["_id"];

  cp: number;
  sp: number;
  quantity: number;
  totalAmount: number;
  isReturned?: boolean;
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
    cp: { type: Number, required: true },
    sp: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    isReturned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const SaleModel = mongoose.model<SaleDocument>("Sale", saleSchema);

export default SaleModel;
