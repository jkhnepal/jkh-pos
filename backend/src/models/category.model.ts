import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface CategoryInput {
  name: string;
  image?: string;
  description?: string;
}

export interface CategoryDocument extends CategoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `category_${nanoid()}`,
    },
    name: { type: String, unique: true, required: true },
    image: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model<CategoryDocument>("Category", CategorySchema);

export default CategoryModel;
