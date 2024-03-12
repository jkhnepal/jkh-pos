import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { PartyDocument } from "./party.model";

export interface PaymentInInput {
  receiptNumber: string;
  paymentDate?: Date;
  party: PartyDocument["_id"];
  paymentMethod: string;
  receivedAmount: number;
  note?: string;
  image?: string;
}

export interface PaymentInDocument extends PaymentInInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentInSchema = new mongoose.Schema(
  {
    paymentInId: {
      type: String,
      required: true,
      unique: true,
      default: () => `payment_in_${nanoid()}`,
    },
    receiptNumber: { type: String, required: true },
    paymentDate: { type: Date },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
    paymentMethod: { type: String, enum: ["cash", "cheque", "online"], required: true },
    receivedAmount: { type: Number, required: true },
    note: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const PaymentInModel = mongoose.model<PaymentInDocument>("PaymentIn", paymentInSchema);

export default PaymentInModel;
