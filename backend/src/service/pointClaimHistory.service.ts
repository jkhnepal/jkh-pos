import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import PointClaimHistoryModel, { PointClaimHistoryInput, PointClaimHistoryDocument } from "../models/pointClaimHistory";

export async function createPointClaimHistory(input: PointClaimHistoryInput): Promise<PointClaimHistoryDocument> {
  const result = await PointClaimHistoryModel.create(input);
  return result;
}

export async function findAllPointClaimHistory(filter: FilterQuery<PointClaimHistoryDocument> = {}): Promise<PointClaimHistoryDocument[]> {
  const results = await PointClaimHistoryModel.find(filter);
  return results;
}

export async function findPointClaimHistory(query: FilterQuery<PointClaimHistoryDocument>, options: QueryOptions = { lean: true }): Promise<PointClaimHistoryDocument | null> {
  const result = await PointClaimHistoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdatePointClaimHistory(query: FilterQuery<PointClaimHistoryDocument>, update: UpdateQuery<PointClaimHistoryDocument>, options: QueryOptions): Promise<PointClaimHistoryDocument | null> {
  const result = PointClaimHistoryModel.findOneAndUpdate(query, update, options);
  return result;
}

export async function deletePointClaimHistory(query: FilterQuery<PointClaimHistoryDocument>): Promise<void> {
  await PointClaimHistoryModel.deleteOne(query);
}
