import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";

export interface MemberInput {
  name: string;
  phone: string;
  point?: number;
  creatorBranch: BranchDocument["_id"];
}

export interface MemberDocument extends MemberInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
      default: () => `member_${nanoid()}`,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    point: { type: Number, default: 0 },
    creatorBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  },
  {
    timestamps: true,
  }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);

export default MemberModel;
