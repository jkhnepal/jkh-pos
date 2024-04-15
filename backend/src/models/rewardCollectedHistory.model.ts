import mongoose from "mongoose";
import { nanoid } from "../utils/nanoid";
import { BranchDocument } from "./branch.model";
import { MemberDocument } from "./member.model";

export interface RewardCollectedHistoryInput {
  branch: BranchDocument["_id"];
  member: MemberDocument["_id"];
  collectedAmount: number;
  isSettledByAdmin?: boolean;
  isSettledByBranch?: boolean;
}

export interface RewardCollectedHistoryDocument extends RewardCollectedHistoryInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const rewardCollectedHistorySchema = new mongoose.Schema(
  {
    rewardCollectedHistoryId: {
      type: String,
      required: true,
      unique: true,
      default: () => `reward_collected_history_${nanoid()}`,
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    collectedAmount: { type: Number, required: true },
    isSettledByAdmin: { type: Boolean, default: false },
    isSettledByBranch: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const RewardCollectedHistoryModel = mongoose.model<RewardCollectedHistoryDocument>("RewardCollectedHistory", rewardCollectedHistorySchema);

export default RewardCollectedHistoryModel;
