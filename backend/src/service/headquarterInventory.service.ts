import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import HeadquarterInventoryModel, { HeadquarterInventoryInput, HeadquarterInventoryDocument } from "../models/headquarterInventory";

export async function createHeadquarterInventory(input: HeadquarterInventoryInput): Promise<HeadquarterInventoryDocument> {
  const result = await HeadquarterInventoryModel.create(input);
  return result;
}

export async function findAllHeadquarterInventory(filter: FilterQuery<HeadquarterInventoryDocument> = {}): Promise<HeadquarterInventoryDocument[]> {
  const results = await HeadquarterInventoryModel.find(filter);
  return results;
}

export async function findHeadquarterInventory(query: FilterQuery<HeadquarterInventoryDocument>, options: QueryOptions = { lean: true }): Promise<HeadquarterInventoryDocument | null> {
  const result = await HeadquarterInventoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateHeadquarterInventory(query: FilterQuery<HeadquarterInventoryDocument>, update: UpdateQuery<HeadquarterInventoryDocument>, options: QueryOptions): Promise<HeadquarterInventoryDocument | null> {
  const result = HeadquarterInventoryModel.findOneAndUpdate(query, update, options);
  return result;
}

export async function deleteHeadquarterInventory(query: FilterQuery<HeadquarterInventoryDocument>): Promise<void> {
  await HeadquarterInventoryModel.deleteOne(query);
}
