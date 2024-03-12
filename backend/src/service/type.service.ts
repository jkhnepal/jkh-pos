import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import TypeModel, { TypeDocument, TypeInput } from "../models/type.model";

export async function createType(input: TypeInput) {
  const result = await TypeModel.create(input);
  return result;
}

export async function findAllType(filter: FilterQuery<TypeDocument> = {}) {
  const results = await TypeModel.find(filter);
  return results;
}

export async function findType(query: FilterQuery<TypeDocument>, options: QueryOptions = { lean: true }) {
  const result = await TypeModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateType(query: FilterQuery<TypeDocument>, update: UpdateQuery<TypeDocument>, options: QueryOptions) {
  return TypeModel.findOneAndUpdate(query, update, options);
}

export async function deleteType(query: FilterQuery<TypeDocument>) {
  return TypeModel.deleteOne(query);
}
