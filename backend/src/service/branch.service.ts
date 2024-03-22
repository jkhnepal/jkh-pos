import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import BranchModel, { BranchInput, BranchDocument } from "../models/branch.model";

export async function createBranch(input: BranchInput) {
  const result = await BranchModel.create(input);
  return result;
}

// export async function findAllBranch(filter: FilterQuery<BranchDocument> = {}) {
//   const results = await BranchModel.find(filter).select("-password").sort({ createdAt: -1 });
//   return results;
// }

export async function findAllBranch(filter: FilterQuery<BranchDocument> = {}) {
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
  };
  const count = await BranchModel.countDocuments();
  const results = await BranchModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 });
  return { count, results };
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
