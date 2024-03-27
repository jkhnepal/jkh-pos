import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { MemberDocument } from "./member.model";
import { SaleDocument } from "./sale.model";

export interface ReturnInput {
  branch: BranchDocument["_id"];
  member: MemberDocument["_id"];
  sale: SaleDocument["_id"];
  quantity: number;
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
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ReturnModel = mongoose.model<ReturnDocument>("Return", returnSchema);

export default ReturnModel;
