import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { CategoryDocument } from "./category.model";

export interface ProductInput {
  name: string;
  sku: string;
  category: CategoryDocument["_id"];

  cp: Number;
  sp: Number;

  image?: string;
  note?: string;

  totalAddedStock?: number;
  availableStock?: number;

  colors?: string;
  sizes?: string;
}

export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoid()}`,
    },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    cp: { type: Number, required: true },
    sp: { type: Number, required: true },

    image: { type: String },
    note: { type: String },

    totalAddedStock: { type: Number, default: 0 },
    availableStock: { type: Number, default: 0 },

    colors: { type: String },
    sizes: { type: String },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;
