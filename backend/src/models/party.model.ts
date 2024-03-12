import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface PartyInput {
  name: string;
  phone: number;
  type: string;

  openingBalance: string;
  openingBalanceDate: Date;
  address: string;

  email: string;
  panNumber: string;
  image: string;
}

export interface PartyDocument extends PartyInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const partySchema = new mongoose.Schema(
  {
    partyId: {
      type: String,
      required: true,
      unique: true,
      default: () => `party_${nanoid()}`,
    },
    name: { type: String, required: true },
    phone: { type: String },
    type: { type: String },
    openingBalance: { type: String },
    openingDate: { type: Date },
    address: { type: String },
    message: { type: String },
    email: { type: String },
    panNumber: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const PartyModel = mongoose.model<PartyDocument>("Party", partySchema);

export default PartyModel;
