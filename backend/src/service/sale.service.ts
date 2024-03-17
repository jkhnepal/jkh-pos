import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SaleModel, { SaleInput, SaleDocument } from "../models/sale.model";

export async function createSale(input: SaleInput) {
  console.log(input);
  const result = await SaleModel.create(input);
  return result;
}

export async function findAllSale(filter: FilterQuery<SaleDocument> = {}) {
  const results = await SaleModel.find(filter);
  return results;
}

export async function findSale(query: FilterQuery<SaleDocument>, options: QueryOptions = { lean: true }) {
  const result = await SaleModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateSale(query: FilterQuery<SaleDocument>, update: UpdateQuery<SaleDocument>, options: QueryOptions) {
  return SaleModel.findOneAndUpdate(query, update, options);
}

export async function deleteSale(query: FilterQuery<SaleDocument>) {
  return SaleModel.deleteOne(query);
}
