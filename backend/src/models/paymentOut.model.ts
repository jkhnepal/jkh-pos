import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { PartyDocument } from "./party.model";

export interface PaymentOutInput {
  paymentNumber: string;
  paymentDate?: Date;
  party: PartyDocument["_id"];
  paymentMethod: string;
  paidAmount: number;
  note?: string;
  image?: string;
}

export interface PaymentOutDocument extends PaymentOutInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentOutSchema = new mongoose.Schema(
  {
    paymentOutId: {
      type: String,
      required: true,
      unique: true,
      default: () => `payment_out_${nanoid()}`,
    },
    paymentNumber: { type: String, required: true },
    paymentDate: { type: Date },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
    paymentMethod: { type: String, enum: ["cash", "cheque", "online"], required: true },
    paidAmount: { type: Number, required: true },
    note: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const PaymentOutModel = mongoose.model<PaymentOutDocument>("PaymentOut", paymentOutSchema);

export default PaymentOutModel;
