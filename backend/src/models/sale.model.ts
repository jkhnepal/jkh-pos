import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { ProductDocument } from "./product.model";
import { TransactionDocument } from "./transaction.model";

export interface SaleInput {
  branch: BranchDocument["_id"];
  product: ProductDocument["_id"];
  transaction: TransactionDocument["_id"];
  memberName?: string;
  memberPhone?: string;

  cp: number;
  sp: number;
  quantity: number;
  totalAmount: number;
  discountAmount: number;
  offerDiscountAmount: number;
  totalDiscountAmount: number;
  returnedQuantity?: number;
  soldAt: number;
  invoiceNo: string;

  
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
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },

    quantity: { type: Number, required: true },
    cp: { type: Number, required: true },
    sp: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    memberName: { type: String },
    memberPhone: { type: String },

    discountAmount: { type: Number, required: true },
    totalDiscountAmount: { type: Number, required: true },
    offerDiscountAmount: { type: Number, required: true },

    returnedQuantity: { type: Number, required: true, default: 0 },
    invoiceNo: { type: String, required: true },
    soldAt: { type: Number, required: true },

   
  },
  {
    timestamps: true,
  }
);

const SaleModel = mongoose.model<SaleDocument>("Sale", saleSchema);

export default SaleModel;
