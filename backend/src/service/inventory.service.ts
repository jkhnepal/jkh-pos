import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import InventoryModel, { InventoryInput, InventoryDocument } from "../models/inventory.model";

export async function createInventory(input: InventoryInput) {
  const result = await InventoryModel.create(input);
  return result;
}

export async function findAllInventory(filter: FilterQuery<InventoryDocument> = {}) {
  const results = await InventoryModel.find(filter);
  return results;
}

export async function findInventory(query: FilterQuery<InventoryDocument>, options: QueryOptions = { lean: true }) {
  const result = await InventoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateInventory(query: FilterQuery<InventoryDocument>, update: UpdateQuery<InventoryDocument>, options: QueryOptions) {
  return InventoryModel.findOneAndUpdate(query, update, options);
}

export async function deleteInventory(query: FilterQuery<InventoryDocument>) {
  return InventoryModel.deleteOne(query);
}
