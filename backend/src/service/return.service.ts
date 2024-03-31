import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ReturnModel, { ReturnInput, ReturnDocument } from "../models/return.model";

export async function createReturn(input: ReturnInput) {
  const result = await ReturnModel.create(input);
  return result;
}

export async function findAllReturn(filter: FilterQuery<ReturnDocument> = {}) {
  const branch = filter.branch || "";
  const search = filter.search || "";
  console.log("🚀 ~ findAllReturn ~ search:", search)
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const count = await ReturnModel.countDocuments({ branch: branch });
  const results1 = await ReturnModel.find({ branch: branch });

  const results = await ReturnModel.find({ branch: branch })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 })
    .populate("member")
    .populate({
      path: "sale",
      populate: {
        path: "product",
        select: "name",
      },
    });

  return { count, results };
}

export async function findReturn(query: FilterQuery<ReturnDocument>, options: QueryOptions = { lean: true }) {
  const result = await ReturnModel.findOne(query, {}, options)
    .populate("branch")
    .populate("member")
    .populate({
      path: "sale",
      populate: {
        path: "product",
      },
    });
  return result;
}

export async function findAndUpdateReturn(query: FilterQuery<ReturnDocument>, update: UpdateQuery<ReturnDocument>, options: QueryOptions) {
  return ReturnModel.findOneAndUpdate(query, update, options);
}

export async function deleteReturn(query: FilterQuery<ReturnDocument>) {
  return ReturnModel.deleteOne(query);
}
