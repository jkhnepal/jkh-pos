import { FilterQuery } from "mongoose";
import ReturnToHeadquarterModel, { ReturnToHeadquarterDocument, ReturnToHeadquarterInput } from "../models/returnToHeadquarter.model";

export async function createReturnToHeadquarter(input: ReturnToHeadquarterInput) {
  const result = await ReturnToHeadquarterModel.create(input);
  return result;
}

export async function findAllReturnHistory(filter: FilterQuery<ReturnToHeadquarterDocument> = {}) {
  const count = await ReturnToHeadquarterModel.countDocuments();
  const results = await ReturnToHeadquarterModel.find()
    .populate({
      path: "branch",
      select: "name ",
    })
    .populate({
      path: "product",
      select: "name returnedQuantity cp sp image ",
    })
    .sort({ createdAt: -1 })
    .exec();
  return { count, results };
}
