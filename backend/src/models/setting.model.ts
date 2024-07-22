import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";

export interface SettingInput {
  billNo: number;
}

export interface SettingDocument extends SettingInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new mongoose.Schema(
  {
    settingId: {
      type: String,
      required: true,
      unique: true,
      default: () => `setting_${nanoid()}`,
    },
    billNo: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SettingModel = mongoose.model<SettingDocument>("Setting", settingSchema);

export default SettingModel;
