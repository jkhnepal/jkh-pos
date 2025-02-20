import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel, { CategoryDocument, CategoryInput } from "../models/category.model";

export async function createCategory(input: CategoryInput) {
  const result = await CategoryModel.create(input);
  return result;
}

export async function findAllCategory(filter: FilterQuery<CategoryDocument> = {}) {
  const sort = filter.sort || "";
  const count = await CategoryModel.countDocuments();
  const results = await CategoryModel.find()
  .sort({ createdAt: sort == "latest" ? -1 : 1 });
  return { count, results };
}

export async function findCategory(query: FilterQuery<CategoryDocument>, options: QueryOptions = { lean: true }) {
  const result = await CategoryModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateCategory(query: FilterQuery<CategoryDocument>, update: UpdateQuery<CategoryDocument>, options: QueryOptions) {
  return CategoryModel.findOneAndUpdate(query, update, options);
}

export async function deleteCategory(query: FilterQuery<CategoryDocument>) {
  return CategoryModel.deleteOne(query);
}
