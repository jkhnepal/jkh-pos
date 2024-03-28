import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import MemberModel from "../models/member.model";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
import BranchInventoryModel from "../models/branchInventory.model";
import SaleModel from "../models/sale.model";
import mongoose from "mongoose";
import ReturnModel from "../models/return.model";
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
      data: { members, categories, branches, products, totalSales: totalSales[0]?.totalAmount | 0 },
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
    const members = await MemberModel.countDocuments();
    const categories = await CategoryModel.countDocuments();

    const totalSales = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    // console.log(totalSales,"???????????????????????????????????????")

    const ress = await ReturnModel.find(queryParameter).populate("sale");
    // console.log(ress);
    // console.log(ress,"/////////////////////////////////////////////////////")
    const totalReturnAmountSumOfABranch = ress.reduce((sum, obj) => sum + obj.sale.totalAmount, 0);

    // console.log(totalReturnAmountSumOfABranch,"pppppppppppppppppppppppppppppppppppppppp")

    const total = totalSales[0].totalAmount - totalReturnAmountSumOfABranch;

    const totalDiscountedPrice = ress.reduce((sum, obj) => {
      // Calculate discounted price
      const discountedPrice = obj.sale.sp * (1 - obj.sale.discount / 100);
      // Multiply discounted price by quantity
      const discountedTotal = discountedPrice * obj.quantity;
      // Add to sum
      return sum + discountedTotal;
    }, 0);

    // console.log("Total Discounted Price:", totalDiscountedPrice);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: { members, products, categories, totalSales: totalSales[0].totalAmount - totalDiscountedPrice },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchProfitHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameter = req.query;
    // console.log("🚀 ~ getBranchProfitHandler ~ queryParameter:", queryParameter);

    const res1 = await SaleModel.find({ branch: queryParameter.branch, isReturned: false });
    // console.log("🚀 ~ getBranchProfitHandler ~ res:", res1);

    const totalSales = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    // console.log(totalSales,"???????????????????????????????????????")

    const totalProfit = res1.reduce((sum, obj) => {
      // Calculate profit by subtracting discount percentage from sale price
      const profit = obj.sp * (1 - obj.discount / 100);
      // Add profit to sum
      return sum + profit;
    }, 0);

    // console.log("Total Profit:", totalProfit);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      totalProfit: totalProfit,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
