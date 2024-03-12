import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { IncomeCategoryDocument } from "./incomeCategory.model";

export interface IncomeInput {
  incomeCategory: IncomeCategoryDocument["_id"];
  amount: number;
  paymentMethod: string;
  date?: Date;
  note?: string;
  image?: string;
}

export interface IncomeDocument extends IncomeInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const incomeSchema = new mongoose.Schema(
  {
    incomeId: {
      type: String,
      required: true,
      unique: true,
      default: () => `income_${nanoid()}`,
    },
    incomeCategory: { type: mongoose.Schema.Types.ObjectId, ref: "IncomeCategory", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "cheque", "online"], required: true },
    date: { type: Date },
    note: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const IncomeModel = mongoose.model<IncomeDocument>("Income", incomeSchema);

export default IncomeModel;
