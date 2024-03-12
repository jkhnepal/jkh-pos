import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { CategoryDocument } from "./category.model";
import { TypeDocument } from "./type.model";
import { UnitDocument } from "./unit.model";
import { Decimal128 } from "bson";

export interface ItemInput {
  // ITEM INFORMATION
  name: string;
  image: string;
  category: CategoryDocument["_id"];
  type: TypeDocument["_id"];

  // ITEM PRICING
  unit: UnitDocument["_id"];
  salesPrice: Decimal128;
  purchasePrice: Decimal128;

  // STOCK DETAIL
  openingStock: number;
  lowStockQuantity: number;
  asOfDate: Date;

  // OTHER DETAIL
  itemCode: string;
  itemLocation: string;
  remarks: string;
}

export interface ItemDocument extends ItemInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      default: () => `item_${nanoid()}`,
    },
    name: { type: String, required: true },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type" },

    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    salesPrice: { type: Decimal128 },
    purchasePrice: { type: Decimal128 },

    openingStock: { type: Number },
    lowStockQuantity: { type: Number },
    asOfDate: { type: Date },

    itemCode: { type: String },
    itemLocation: { type: String },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

const ItemModel = mongoose.model<ItemDocument>("Item", itemSchema);

export default ItemModel;
