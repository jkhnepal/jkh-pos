import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { ExpenseCategoryDocument } from "./expenseCategory.model";

export interface ExpenseInput {
  expenseCategory: ExpenseCategoryDocument["_id"];
  amount: number;
  paymentMethod: string;
  date?: Date;
  note?: string;
  image?: string;
}

export interface ExpenseDocument extends ExpenseInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new mongoose.Schema(
  {
    expenseId: {
      type: String,
      required: true,
      unique: true,
      default: () => `expense_${nanoid()}`,
    },
    expenseCategory: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory", required: true },
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

const ExpenseModel = mongoose.model<ExpenseDocument>("Expense", expenseSchema);

export default ExpenseModel;
