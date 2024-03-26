import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import MemberModel, { MemberInput, MemberDocument } from "../models/member.model";

export async function createMember(input: MemberInput) {
  const result = await MemberModel.create(input);
  return result;
}

export async function findAllMember(filter: FilterQuery<MemberDocument> = {}) {
  const search = filter.search || "";
  const sort = filter.sort || "";
  const page: any = filter.page || 1;
  const limit: any = filter.limit || 5;
  const skip = (page - 1) * limit;

  // const searchQuery: any = {
  //   name: { $regex: search, $options: "i" },
  // };
  const searchQuery: any = {
    $or: [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }],
  };

  const count = await MemberModel.countDocuments();
  const results = await MemberModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort == "latest" ? -1 : 1 });
  return { count, results };
}

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
