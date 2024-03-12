import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface CashInHandInput {
  amount: number;
  date?: Date;
  note?: string;
}

export interface CashInHandDocument extends CashInHandInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const cashInHandSchema = new mongoose.Schema(
  {
    cashInHandId: {
      type: String,
      required: true,
      unique: true,
      default: () => `cash_in_hand_${nanoid()}`,
    },
    amount: { type: Number, required: true },
    date: { type: Date },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

const CashInHandModel = mongoose.model<CashInHandDocument>("CashInHand", cashInHandSchema);

export default CashInHandModel;
