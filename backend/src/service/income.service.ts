import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import IncomeModel, { IncomeDocument, IncomeInput } from "../models/income.model";


export async function createIncome(input: IncomeInput) {
  const result = await IncomeModel.create(input);
  return result;
}

export async function findAllIncome(filter: FilterQuery<IncomeDocument> = {}) {
  const results = await IncomeModel.find(filter).populate("incomeCategory");
  return results;
}

export async function findIncome(query: FilterQuery<IncomeDocument>, options: QueryOptions = { lean: true }) {
  const result = await IncomeModel.findOne(query, {}, options).populate("incomeCategory");
  return result;
}

export async function findAndUpdateIncome(query: FilterQuery<IncomeDocument>, update: UpdateQuery<IncomeDocument>, options: QueryOptions) {
  return IncomeModel.findOneAndUpdate(query, update, options);
}

export async function deleteIncome(query: FilterQuery<IncomeDocument>) {
  return IncomeModel.deleteOne(query);
}
