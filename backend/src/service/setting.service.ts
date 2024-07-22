import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import SettingModel, { SettingDocument, SettingInput } from "../models/setting.model";

export async function createSetting(input: SettingInput) {
  const result = await SettingModel.create(input);
  return result;
}

export async function findAllSetting(filter: FilterQuery<SettingDocument> = {}) {
  const results = await SettingModel.find().sort();
  return results;
}

export async function findSetting(query: FilterQuery<SettingDocument>, options: QueryOptions = { lean: true }) {
  const result = await SettingModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdateSetting(query: FilterQuery<SettingDocument>, update: UpdateQuery<SettingDocument>, options: QueryOptions) {
  return SettingModel.findOneAndUpdate(query, update, options);
}

export async function deleteSetting(query: FilterQuery<SettingDocument>) {
  return SettingModel.deleteOne(query);
}
