import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";
import { MemberDocument } from "./member.model";

export interface ReturnInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  member: MemberDocument["_id"];

  sp: number;
  discount: number; // in %
  quantity: number;
  totalAmount: number;

  newProduct: ProductDocument["_id"][];
  extraAddedAmount: number;
  
}

export interface ReturnDocument extends ReturnInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const returnSchema = new mongoose.Schema(
  {
    returnId: {
      type: String,
      required: true,
      unique: true,
      default: () => `return_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },

    quantity: { type: Number, required: true },
    discount: { type: Number, required: true },
    sp: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    newProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    extraAddedAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const ReturnModel = mongoose.model<ReturnDocument>("Return", returnSchema);

export default ReturnModel;
