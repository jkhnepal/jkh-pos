import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { CategoryDocument } from "./category.model";

export interface ProductInput {
  name: string;
  sku: string;
  category: CategoryDocument["_id"];

  cp: Number;
  sp: Number;
  discount?: Number; // in %

  image?: string;
  note?: string;
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
    discount: { type: Number, default: 0 },

    image: { type: String },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;
