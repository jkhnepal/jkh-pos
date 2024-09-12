import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";

export interface TransactionInput {
  branch: BranchDocument["_id"];
  memberName?: string;
  memberPhone?: string;
  invoiceNo: string;

  // cashPaid: number;
  // onlinePaid: number;

  sales: {
    product: ProductDocument["_id"];
    memberName?: string;
    memberPhone?: string;
    cp: number;
    sp: number;
    quantity: number;
    totalAmount: number;
    discountAmount: number;
    totalDiscountAmount: number;
    returnedQuantity?: number;
    invoiceNo: string;
  }[];
}

export interface TransactionDocument extends TransactionInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `transaction_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    memberName: { type: String },
    memberPhone: { type: String },
    invoiceNo: { type: String, required: true },

    // cashPaid: { type: Number, required: true },
    // onlinePaid: { type: Number, required: true },
    
    sales: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        memberName: { type: String },
        memberPhone: { type: String },
        quantity: { type: Number, required: true },
        cp: { type: Number, required: true },
        sp: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        discountAmount: { type: Number, required: true },
        totalDiscountAmount: { type: Number, required: true },
        returnedQuantity: { type: Number, required: true, default: 0 },
        invoiceNo: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.model<TransactionDocument>("Trasnaction", transactionSchema);

export default TransactionModel;
