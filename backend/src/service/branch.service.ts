import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import BranchModel, { BranchInput, BranchDocument } from "../models/branch.model";

export async function createBranch(input: BranchInput) {
  const result = await BranchModel.create(input);
  return result;
}

export async function findAllBranch(filter: FilterQuery<BranchDocument> = {}) {
  const results = await BranchModel.find(filter).select("-password").sort({ createdAt: -1 });
  return results;
}

export async function findBranch(query: FilterQuery<BranchDocument>, options: QueryOptions = { lean: true }) {
  const result = await BranchModel.findOne(query, {}, options).select("-password");
  return result;
}

export async function findAndUpdateBranch(query: FilterQuery<BranchDocument>, update: UpdateQuery<BranchDocument>, options: QueryOptions) {
  return BranchModel.findOneAndUpdate(query, update, options).select("-password");
}

export async function deleteBranch(query: FilterQuery<BranchDocument>) {
  return BranchModel.deleteOne(query).select("-password");
}
