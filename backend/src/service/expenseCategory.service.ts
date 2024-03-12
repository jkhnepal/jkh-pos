import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ExpenseCategoryModel, { ExpenseCategoryInput, ExpenseCategoryDocument } from "../models/expenseCategory.model";

export async function createExpenseCategory(input: ExpenseCategoryInput) {
  const result = await ExpenseCategoryModel.create(input);
  return result;
}

export async function findAllExpenseCategory(filter: FilterQuery<ExpenseCategoryDocument> = {}) {
  // Converting the name value to a case-insensitive regex pattern
  if (filter.name) {
    filter.name = { $regex: new RegExp(filter.name, "i") };
  }
  const results = await ExpenseCategoryModel.find(filter);
  return results;
}

export async function findExpenseCategory(query: FilterQuery<ExpenseCategoryDocument>, options: QueryOptions = { lean: true }) {
  const result = await ExpenseCategoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateExpenseCategory(query: FilterQuery<ExpenseCategoryDocument>, update: UpdateQuery<ExpenseCategoryDocument>, options: QueryOptions) {
  return ExpenseCategoryModel.findOneAndUpdate(query, update, options);
}

export async function deleteExpenseCategory(query: FilterQuery<ExpenseCategoryDocument>) {
  return ExpenseCategoryModel.deleteOne(query);
}
