import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface ExpenseCategoryInput {
  name: string;
}

export interface ExpenseCategoryDocument extends ExpenseCategoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseCategorySchema = new mongoose.Schema(
  {
    expenseCategoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `expense_category_${nanoid()}`,
    },
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

const ExpenseCategoryModel = mongoose.model<ExpenseCategoryDocument>("ExpenseCategory", ExpenseCategorySchema);

export default ExpenseCategoryModel;
