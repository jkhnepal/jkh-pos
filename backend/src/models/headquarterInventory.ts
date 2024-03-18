import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { ProductDocument } from "./product.model";

export interface HeadquarterInventoryInput {
  product: ProductDocument["_id"];
  stock: number;
}

export interface HeadquarterInventoryDocument extends HeadquarterInventoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const headquarterInventorySchema = new mongoose.Schema(
  {
    headquarterInventoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `headquarter_inventory_${nanoid()}`,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    stock: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const HeadquarterInventoryModel = mongoose.model<HeadquarterInventoryDocument>("HeadquarterInventory", headquarterInventorySchema);

export default HeadquarterInventoryModel;
