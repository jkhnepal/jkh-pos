import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import PaymentInModel, { PaymentInInput, PaymentInDocument } from "../models/paymentIn.model";

export async function createPaymentIn(input: PaymentInInput) {
  const result = await PaymentInModel.create(input);
  return result;
}

export async function findAllPaymentIn(filter: FilterQuery<PaymentInDocument> = {}) {
  const results = await PaymentInModel.find(filter);
  return results;
}

export async function findPaymentIn(query: FilterQuery<PaymentInDocument>, options: QueryOptions = { lean: true }) {
  const result = await PaymentInModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdatePaymentIn(query: FilterQuery<PaymentInDocument>, update: UpdateQuery<PaymentInDocument>, options: QueryOptions) {
  return PaymentInModel.findOneAndUpdate(query, update, options);
}

export async function deletePaymentIn(query: FilterQuery<PaymentInDocument>) {
  return PaymentInModel.deleteOne(query);
}
