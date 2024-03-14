import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { ProductDocument } from "./product.model";

export interface InventoryInput {
  product: ProductDocument["_id"];
  stock: number;
}

export interface InventoryDocument extends InventoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new mongoose.Schema(
  {
    inventoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `inventory_${nanoid()}`,
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    stock: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const InventoryModel = mongoose.model<InventoryDocument>("Inventory", inventorySchema);

export default InventoryModel;
