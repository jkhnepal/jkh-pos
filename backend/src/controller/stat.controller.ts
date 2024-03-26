import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import MemberModel from "../models/member.model";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
import BranchInventoryModel from "../models/branchInventory.model";
import SaleModel from "../models/sale.model";
var colors = require("colors");

export async function getHeadquarterStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const branches = await BranchModel.countDocuments();
    const categories = await CategoryModel.countDocuments();
    const products = await ProductModel.countDocuments();
    const members = await MemberModel.countDocuments();

    const totalSales = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: { members, categories, branches, products, totalSales:totalSales[0].totalAmount },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameter = req.query;

    const products = await BranchInventoryModel.countDocuments(queryParameter);
    const sales: any = await SaleModel.countDocuments(queryParameter);
    const members = await MemberModel.countDocuments();
    const categories = await CategoryModel.countDocuments();

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: { members, products, categories },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
