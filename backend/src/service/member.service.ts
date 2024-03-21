import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MemberModel, { MemberInput, MemberDocument } from "../models/member.model";

export async function createMember(input: MemberInput) {
  const result = await MemberModel.create(input);
  return result;
}

export async function findAllMember(filter: FilterQuery<MemberDocument> = {}) {
  
  const results = await MemberModel.find(filter);
  console.log(results);
  return results;
}

// export async function findAllMember(filter: FilterQuery<MemberDocument> = {}) {
//   const regex = new RegExp(filter.phone, 'i'); // 'i' flag for case-insensitive matching
//   const results = await MemberModel.find({ phone: { $regex: regex } });
//   return results;
// }

export async function findMember(query: FilterQuery<MemberDocument>, options: QueryOptions = { lean: true }) {
  const result = await MemberModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateMember(query: FilterQuery<MemberDocument>, update: UpdateQuery<MemberDocument>, options: QueryOptions) {
  return MemberModel.findOneAndUpdate(query, update, options);
}

export async function deleteMember(query: FilterQuery<MemberDocument>) {
  return MemberModel.deleteOne(query);
}
