import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SaleModel, { SaleInput, SaleDocument } from "../models/sale.model";

export async function createSale(input: SaleInput) {
  const result = await SaleModel.create(input);
  return result;
}

// export async function findAllSale(filter: FilterQuery<SaleDocument> = {}) {
//   const branch = filter.branch || "";
//   const transaction = filter.transaction || "";
//   const search = filter.search || "";
//   const sort = filter.sort || "";
//   const page: any = filter.page || 1;
//   const limit: any = filter.limit || 5;
//   const skip = (page - 1) * limit;
//   console.log(transaction)

//   const searchQuery: any = {
//     name: { $regex: search, $options: "i" },
//     branch: branch,
//     transaction: transaction,
//   };
//   const count = await SaleModel.countDocuments({ branch: branch });
//   const results = await SaleModel.find(searchQuery)
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: sort == "latest" ? -1 : 1 })
//     .populate("product");

//   return { count, results };
// }



export async function findAllSale(filter: FilterQuery<SaleDocument> = {}) {

  const results = await SaleModel.find(filter).populate("product");
    

  return results;
}



export async function findSale(query: FilterQuery<SaleDocument>, options: QueryOptions = { lean: true }) {
  const result = await SaleModel.findOne(query, {}, options).populate("branch product");
  return result;
}

export async function findAndUpdateSale(query: FilterQuery<SaleDocument>, update: UpdateQuery<SaleDocument>, options: QueryOptions) {
  return SaleModel.findOneAndUpdate(query, update, options);
}

export async function deleteSale(query: FilterQuery<SaleDocument>) {
  return SaleModel.deleteOne(query);
}
