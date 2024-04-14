import ReturnToHeadquarterModel, { ReturnToHeadquarterDocument, ReturnToHeadquarterInput } from "../models/returnToHeadquarter.model";

export async function createReturnToHeadquarter(input: ReturnToHeadquarterInput) {
  const result = await ReturnToHeadquarterModel.create(input);
  return result;
}

// export async function findAllReturnToHeadquarter(filter: FilterQuery<ReturnToHeadquarterDocument> = {}) {
//   const search = filter.search || "";
//   const sort = filter.sort || "";
//   const page: any = filter.page || 1;
//   const limit: any = filter.limit || 5;
//   const skip = (page - 1) * limit;

//   const searchQuery: any = {
//     name: { $regex: search, $options: "i" },
//   };
//   const count = await ReturnToHeadquarterModel.countDocuments();
//   const results = await ReturnToHeadquarterModel.find(searchQuery)
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: sort == "latest" ? -1 : 1 })
//     .populate("branch product");

//   return { count, results };
// }

// export async function findAllReturnToHeadquarterOfABranch(filter: FilterQuery<ReturnToHeadquarterDocument> = {}) {
//   const branch = filter.branch || "";
//   const search = filter.search || "";
//   const sort = filter.sort || "";
//   const page: any = filter.page || 1;
//   const limit: any = filter.limit || 5;
//   const skip = (page - 1) * limit;

//   const searchQuery: any = {
//     name: { $regex: search, $options: "i" },
//     branch: branch,
//   };

//   const count = await ReturnToHeadquarterModel.countDocuments(searchQuery);
//   const results = await ReturnToHeadquarterModel.find(searchQuery)
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: sort == "latest" ? -1 : 1 })
//     .populate("product");

//   return { count, results };
// }

// export async function findAllReturnToHeadquarterOfABranch(filter: FilterQuery<ReturnToHeadquarterDocument> = {}) {
//   const branch = filter.branch || "";
//   const search = filter.search || "";
//   const sort = filter.sort || "";
//   const page: any = filter.page || 1;
//   const limit: any = filter.limit || 5;
//   const skip = (page - 1) * limit;

//   const searchQuery: any = {
//     name: { $regex: search, $options: "i" },
//     branch: branch,
//   };

//   const count = await ReturnToHeadquarterModel.countDocuments(searchQuery);
//   const results: any = await ReturnToHeadquarterModel.find(searchQuery)
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: sort == "latest" ? -1 : 1 })
//     .populate("product");

//   // // Calculate sold quantities
//   // for (const result of results) {
//   //   // console.log(result)
//   //   const branchInventory = await BranchInventoryModel.findOne({ product: result?.product._id });
//   //   // console.log("🚀 ~ findAllReturnToHeadquarterOfABranch ~ branchInventory:", branchInventory)
//   //   if (branchInventory) {
//   //     result.soldQuantity = result.stock - branchInventory.totalStock;
//   //   // result.soldQuantity = branchInventory.totalStock - result.stock;
//   //   }
//   // }

//   // // Calculate and add sold quantities to each result object
//   // for (let i = 0; i < results.length; i++) {
//   //   const branchInventory = await BranchInventoryModel.findOne({ product: results[i].product });
//   //   if (branchInventory) {
//   //     results[i] = results[i].toObject(); // Convert result to plain object
//   //     results[i].soldQuantity = branchInventory.totalStock - results[i].stock;
//   //   }
//   // }
//   // console.log(results)

//   return { count, results };
// }

// export async function findReturnToHeadquarter(query: FilterQuery<ReturnToHeadquarterDocument>, options: QueryOptions = { lean: true }) {
//   const result = await ReturnToHeadquarterModel.findOne(query, {}, options);
//   return result;
// }

// export async function findAndUpdateReturnToHeadquarter(query: FilterQuery<ReturnToHeadquarterDocument>, update: UpdateQuery<ReturnToHeadquarterDocument>, options: QueryOptions) {
//   return ReturnToHeadquarterModel.findOneAndUpdate(query, update, options);
// }

// export async function deleteReturnToHeadquarter(query: FilterQuery<ReturnToHeadquarterDocument>) {
//   return ReturnToHeadquarterModel.deleteOne(query);
// }
