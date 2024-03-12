import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ExpenseModel, { ExpenseInput, ExpenseDocument } from "../models/expense.model";


export async function createExpense(input: ExpenseInput) {
  const result = await ExpenseModel.create(input);
  return result;
}

export async function findAllExpense(filter: FilterQuery<ExpenseDocument> = {}) {
  const results = await ExpenseModel.find(filter);
  return results;
}

export async function findExpense(query: FilterQuery<ExpenseDocument>, options: QueryOptions = { lean: true }) {
  const result = await ExpenseModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateExpense(query: FilterQuery<ExpenseDocument>, update: UpdateQuery<ExpenseDocument>, options: QueryOptions) {
  return ExpenseModel.findOneAndUpdate(query, update, options);
}

export async function deleteExpense(query: FilterQuery<ExpenseDocument>) {
  return ExpenseModel.deleteOne(query);
}
