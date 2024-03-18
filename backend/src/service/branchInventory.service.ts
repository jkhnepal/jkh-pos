import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import BranchInventoryModel, { BranchInventoryInput, BranchInventoryDocument } from "../models/branchInventory.model";

export async function createBranchInventory(input: BranchInventoryInput): Promise<BranchInventoryDocument> {
  const result = await BranchInventoryModel.create(input);
  return result;
}

export async function findAllBranchInventory(filter: FilterQuery<BranchInventoryDocument> = {}): Promise<BranchInventoryDocument[]> {
  const results = await BranchInventoryModel.find(filter);
  return results;
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
