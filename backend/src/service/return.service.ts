import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ReturnModel, { ReturnInput, ReturnDocument } from "../models/return.model";

export async function createReturn(input: ReturnInput) {
  const result = await ReturnModel.create(input);
  return result;
}

export async function findAllReturn(filter: FilterQuery<ReturnDocument> = {}) {
  const branch = filter.branch || "";
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
    branchId: branch,
  };
  const count = await ReturnModel.countDocuments({ branch: branch });
  const results = await ReturnModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 })
    .populate({
      path: "product",
      select: "name image",
    })
    .populate({
      path: "member",
      select: "name phone",
    });
  return { count, results };
}

export async function findReturn(query: FilterQuery<ReturnDocument>, options: QueryOptions = { lean: true }) {
  const result = await ReturnModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateReturn(query: FilterQuery<ReturnDocument>, update: UpdateQuery<ReturnDocument>, options: QueryOptions) {
  return ReturnModel.findOneAndUpdate(query, update, options);
}

export async function deleteReturn(query: FilterQuery<ReturnDocument>) {
  return ReturnModel.deleteOne(query);
}
