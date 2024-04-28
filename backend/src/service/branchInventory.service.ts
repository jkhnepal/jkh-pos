import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import BranchInventoryModel, { BranchInventoryInput, BranchInventoryDocument } from "../models/branchInventory.model";

export async function createBranchInventory(input: BranchInventoryInput): Promise<BranchInventoryDocument> {
  const result = await BranchInventoryModel.create(input);
  return result;
}

export async function findAllBranchInventory(filter: FilterQuery<BranchInventoryDocument> = {}) {
  const branch = filter.branch || "";
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
    branch: branch,
    totalStock: { $gt: 0 },
  };
  const count = await BranchInventoryModel.countDocuments(searchQuery);
  const results = await BranchInventoryModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 })
    .populate({
      path: "product",
      select: "name image productId sku cp sp",
    });
  return { count, results };
}

export async function findBranchInventory(query: FilterQuery<BranchInventoryDocument>, options: QueryOptions = { lean: true }): Promise<BranchInventoryDocument | null> {
  const result = await BranchInventoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateBranchInventory(query: FilterQuery<BranchInventoryDocument>, update: UpdateQuery<BranchInventoryDocument>, options: QueryOptions): Promise<BranchInventoryDocument | null> {
  const result = BranchInventoryModel.findOneAndUpdate(query, update, options);
  return result;
}

export async function deleteBranchInventory(query: FilterQuery<BranchInventoryDocument>): Promise<void> {
  await BranchInventoryModel.deleteOne(query);
}
