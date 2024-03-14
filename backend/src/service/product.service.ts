import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductInput, ProductDocument } from "../models/product.model";

export async function createProduct(input: ProductInput) {
  const result = await ProductModel.create(input);
  return result;
}

export async function findAllProduct(filter: FilterQuery<ProductDocument> = {}) {
  // Converting the name value to a case-insensitive regex pattern
  if (filter.name) {
    filter.name = { $regex: new RegExp(filter.name, "i") };
  }
  const results = await ProductModel.find(filter);
  return results;
}

export async function findProduct(query: FilterQuery<ProductDocument>, options: QueryOptions = { lean: true }) {
  const result = await ProductModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateProduct(query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, options: QueryOptions) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
