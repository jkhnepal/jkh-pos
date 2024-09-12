import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import TransactionModel, { TransactionInput, TransactionDocument } from "../models/transaction.model";


export async function createTransaction(input: TransactionInput) {
  const result = await TransactionModel.create(input);
  return result;
}

export async function findAllTransaction(filter: FilterQuery<TransactionDocument> = {}) {
  // const branch = filter.branch || "";
  // const search = filter.search || "";
  // const sort = filter.sort || "";
  // const page: any = filter.page || 1;
  // const limit: any = filter.limit || 5;
  // const skip = (page - 1) * limit;

  // const searchQuery: any = {
  //   name: { $regex: search, $options: "i" },
  //   branch: branch,
  // };
  const count = await TransactionModel.countDocuments(filter);

  // const results = await TransactionModel.find()
  const results = await TransactionModel.find(filter).sort({ createdAt: -1 })
  .populate({
    path: 'sales.product',
    model: 'Product', // Referencing the Product model
  })
  .populate('branch'); // Populate branch field if needed













    // .skip(skip)
    // .limit(limit)
    // .sort({ createdAt: sort == "latest" ? -1 : 1 })
    // .populate("product");

  return { count, results };
}

export async function findTransaction(query: FilterQuery<TransactionDocument>, options: QueryOptions = { lean: true }) {
  const result = await TransactionModel.findOne(query, {}, options).populate("branch");
  return result;
}

export async function findAndUpdateTransaction(query: FilterQuery<TransactionDocument>, update: UpdateQuery<TransactionDocument>, options: QueryOptions) {
  return TransactionModel.findOneAndUpdate(query, update, options);
}

export async function deleteTransaction(query: FilterQuery<TransactionDocument>) {
  return TransactionModel.deleteOne(query);
}
