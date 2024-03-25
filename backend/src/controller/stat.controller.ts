import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateMemberInput, UpdateMemberInput } from "../schema/member.schema";
import { findMember, createMember, findAllMember, findAndUpdateMember, deleteMember } from "../service/member.service";
import MemberModel from "../models/member.model";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
var colors = require("colors");

export async function getStatOfHeadquarter(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const members = await MemberModel.countDocuments();
    const categories = await CategoryModel.countDocuments();
    const branches = await BranchModel.countDocuments();
    const products = await ProductModel.countDocuments();

 
    return res.json({
      status: "success",
      msg: "Get all member success",
      data: {members,categories,branches,products},
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
