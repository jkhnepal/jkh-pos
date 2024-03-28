import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { MemberDocument } from "./member.model";

export interface PointClaimHistoryInput {
  member: MemberDocument["_id"];
  branch: BranchDocument["_id"];
  claimPoint: number;
}

export interface PointClaimHistoryDocument extends PointClaimHistoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const pointClaimHistorySchema = new mongoose.Schema(
  {
    pointClaimHistoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `point_claim_history_id_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    claimPoint: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const PointClaimHistoryModel = mongoose.model<PointClaimHistoryDocument>("PointClaimHistory", pointClaimHistorySchema);

export default PointClaimHistoryModel;
