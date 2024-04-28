import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductInput, ProductDocument } from "../models/product.model";

export async function createProduct(input: ProductInput) {
  const result = await ProductModel.create(input);
  return result;
}

export async function findAllProduct(filter: FilterQuery<ProductDocument> = {}) {
  const search = filter.search || "";
  const category = filter.category || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
  };

  // Adding category filter if provided
  if (category !== "") {
    searchQuery.category = category;
  }
  const count = await ProductModel.countDocuments();
  const results = await ProductModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 });
  return { count, results };
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
