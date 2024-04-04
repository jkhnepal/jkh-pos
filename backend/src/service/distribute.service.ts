import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import DistributeModel, { DistributeInput, DistributeDocument } from "../models/distribute.model";

export async function createDistribute(input: DistributeInput) {
  const result = await DistributeModel.create(input);
  return result;
}

export async function findAllDistribute(filter: FilterQuery<DistributeDocument> = {}) {
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
  };
  const count = await DistributeModel.countDocuments();
  const results = await DistributeModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 })
    .populate("branch product");

  return { count, results };
}

export async function findAllDistributeOfABranch(filter: FilterQuery<DistributeDocument> = {}) {
  const branch = filter.branch || "";
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
    branch: branch,
  };

  const count = await DistributeModel.countDocuments(searchQuery);
  const results = await DistributeModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 })
    .populate("product");

  return { count, results };
}

export async function findDistribute(query: FilterQuery<DistributeDocument>, options: QueryOptions = { lean: true }) {
  const result = await DistributeModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateDistribute(query: FilterQuery<DistributeDocument>, update: UpdateQuery<DistributeDocument>, options: QueryOptions) {
  return DistributeModel.findOneAndUpdate(query, update, options);
}

export async function deleteDistribute(query: FilterQuery<DistributeDocument>) {
  return DistributeModel.deleteOne(query);
}
