import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import PaymentOutModel, { PaymentOutDocument, PaymentOutInput } from "../models/paymentOut.model";

export async function createPaymentOut(input: PaymentOutInput) {
  const result = await PaymentOutModel.create(input);
  return result;
}

export async function findAllPaymentOut(filter: FilterQuery<PaymentOutDocument> = {}) {
  const results = await PaymentOutModel.find(filter);
  return results;
}

export async function findPaymentOut(query: FilterQuery<PaymentOutDocument>, options: QueryOptions = { lean: true }) {
  const result = await PaymentOutModel.findOne(query, {}, options);
  return result;
}

export async function findAndUpdatePaymentOut(query: FilterQuery<PaymentOutDocument>, update: UpdateQuery<PaymentOutDocument>, options: QueryOptions) {
  return PaymentOutModel.findOneAndUpdate(query, update, options);
}

export async function deletePaymentOut(query: FilterQuery<PaymentOutDocument>) {
  return PaymentOutModel.deleteOne(query);
}
