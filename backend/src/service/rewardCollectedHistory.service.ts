import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import RewardCollectedHistoryModel, { RewardCollectedHistoryDocument, RewardCollectedHistoryInput } from "../models/rewardCollectedHistory.model";

export async function createRewardCollectedHistory(input: RewardCollectedHistoryInput): Promise<RewardCollectedHistoryDocument> {
  const result = await RewardCollectedHistoryModel.create(input);
  return result;
}

export async function findAllRewardCollectedHistory(filter: FilterQuery<RewardCollectedHistoryDocument> = {}) {
  console.log(filter, "filter");

  const count = await RewardCollectedHistoryModel.countDocuments(filter);
  const results: any = await RewardCollectedHistoryModel.find(filter)
    .populate({
      path: "branch",
      select: "name image phone address",
    })
    .populate({
      path: "member",
      select: "name phone",
    });

  return { count, results };
}

export async function findRewardCollectedHistory(query: FilterQuery<RewardCollectedHistoryDocument>, options: QueryOptions = { lean: true }): Promise<RewardCollectedHistoryDocument | null> {
  const result = await RewardCollectedHistoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateRewardCollectedHistory(query: FilterQuery<RewardCollectedHistoryDocument>, update: UpdateQuery<RewardCollectedHistoryDocument>, options: QueryOptions): Promise<RewardCollectedHistoryDocument | null> {
  const result = RewardCollectedHistoryModel.findOneAndUpdate(query, update, options);
  return result;
}

export async function deleteRewardCollectedHistory(query: FilterQuery<RewardCollectedHistoryDocument>): Promise<void> {
  await RewardCollectedHistoryModel.deleteOne(query);
}
