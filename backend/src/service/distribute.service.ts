import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import DistributeModel, { DistributeInput, DistributeDocument } from "../models/distribute.model";

export async function createDistribute(input: DistributeInput) {
  const result = await DistributeModel.create(input);
  return result;
}

export async function findAllDistribute(filter: FilterQuery<DistributeDocument> = {}) {
  const results = await DistributeModel.find(filter).populate("branch product");
  return results;
}

export async function findDistribute(query: FilterQuery<DistributeDocument>, options: QueryOptions = { lean: true }) {
  const result = await DistributeModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateDistribute(query: FilterQuery<DistributeDocument>, update: UpdateQuery<DistributeDocument>, options: QueryOptions) {
  return DistributeModel.findOneAndUpdate(query, update, options);
}

export async function deleteDistribute(query: FilterQuery<DistributeDocument>) {
  return DistributeModel.deleteOne(query);
}

export async function getTotalDistributedStock(product: string) {
  const product_id = new mongoose.Types.ObjectId(product); // Convert product string to ObjectId
  const totalDistributedStock = await DistributeModel.aggregate([
    {
      $match: { product: product_id },
    },
    {
      $group: {
        _id: "$product",
        totalStock: { $sum: "$quantity" },
      },
    },
  ]);
  return totalDistributedStock[0]?.totalStock;
}

