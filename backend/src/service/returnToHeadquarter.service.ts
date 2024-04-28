import ReturnToHeadquarterModel, { ReturnToHeadquarterInput } from "../models/returnToHeadquarter.model";

export async function createReturnToHeadquarter(input: ReturnToHeadquarterInput) {
  const result = await ReturnToHeadquarterModel.create(input);
  return result;
}

