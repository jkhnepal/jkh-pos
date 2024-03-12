import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import IncomeCategoryModel, { IncomeCategoryInput, IncomeCategoryDocument } from "../models/incomeCategory.model";

export async function createIncomeCategory(input: IncomeCategoryInput) {
  const result = await IncomeCategoryModel.create(input);
  return result;
}

export async function findAllIncomeCategory(filter: FilterQuery<IncomeCategoryDocument> = {}) {
  const results = await IncomeCategoryModel.find(filter);
  return results;
}

export async function findIncomeCategory(query: FilterQuery<IncomeCategoryDocument>, options: QueryOptions = { lean: true }) {
  const result = await IncomeCategoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateIncomeCategory(query: FilterQuery<IncomeCategoryDocument>, update: UpdateQuery<IncomeCategoryDocument>, options: QueryOptions) {
  return IncomeCategoryModel.findOneAndUpdate(query, update, options);
}

export async function deleteIncomeCategory(query: FilterQuery<IncomeCategoryDocument>) {
  return IncomeCategoryModel.deleteOne(query);
}
