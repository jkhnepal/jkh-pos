import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface IncomeCategoryInput {
  name: string;
}

export interface IncomeCategoryDocument extends IncomeCategoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const IncomeCategorySchema = new mongoose.Schema(
  {
    incomeCategoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `income_category_${nanoid()}`,
    },
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

const IncomeCategoryModel = mongoose.model<IncomeCategoryDocument>("IncomeCategory", IncomeCategorySchema);

export default IncomeCategoryModel;
