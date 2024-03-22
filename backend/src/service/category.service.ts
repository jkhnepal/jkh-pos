import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel, { CategoryDocument, CategoryInput } from "../models/category.model";

export async function createCategory(input: CategoryInput) {
  const result = await CategoryModel.create(input);
  return result;
}

// export async function findAllCategory(filter: FilterQuery<CategoryDocument> = {}) {
//   // Converting the name value to a case-insensitive regex pattern
//   if (filter.name) {
//     filter.name = { $regex: new RegExp(filter.name, "i") };
//   }

//   const results = await CategoryModel.find(filter);
//   return results;
// }

export async function findAllCategory(filter: FilterQuery<CategoryDocument> = {}) {
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  const searchQuery: any = {
    name: { $regex: search, $options: "i" },
  };
  const count = await CategoryModel.countDocuments();
  const results = await CategoryModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
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
