import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import UnitModel, { UnitInput, UnitDocument } from "../models/unit.model";

export async function createUnit(input: UnitInput) {
  const result = await UnitModel.create(input);
  return result;
}

export async function findAllUnit(filter: FilterQuery<UnitDocument> = {}) {
  const results = await UnitModel.find(filter);
  return results;
}

export async function findUnit(query: FilterQuery<UnitDocument>, options: QueryOptions = { lean: true }) {
  const result = await UnitModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateUnit(query: FilterQuery<UnitDocument>, update: UpdateQuery<UnitDocument>, options: QueryOptions) {
  return UnitModel.findOneAndUpdate(query, update, options);
}

export async function deleteUnit(query: FilterQuery<UnitDocument>) {
  return UnitModel.deleteOne(query);
}
