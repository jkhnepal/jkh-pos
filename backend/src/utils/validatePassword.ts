import { omit } from "lodash";
import bcrypt from "bcrypt";
import BranchModel from "../models/branch.model";

interface IValidatePasswordParams {
  email_phone?: string;
  password: string;
}

export async function validatePassword({ email_phone, password }: IValidatePasswordParams) {
  if (!email_phone) {
    throw new Error("Either email or phone is required");
  }

  let branch;
  if (email_phone.includes("@")) {
    branch = await BranchModel.findOne({ email: email_phone });
  } else {
    branch = await BranchModel.findOne({ phone: email_phone });
  }

  if (!branch) {
    return false;
  }

  const isValid = await bcrypt.compare(password, branch.password);
  if (!isValid) return false;

  return omit(branch.toJSON(), "password");
}
