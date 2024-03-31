import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import MemberModel from "../models/member.model";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
import BranchInventoryModel from "../models/branchInventory.model";
import SaleModel from "../models/sale.model";
import mongoose from "mongoose";
var colors = require("colors");

export async function getHeadquarterStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const branches = await BranchModel.countDocuments();
    const categories = await CategoryModel.countDocuments();
    const products = await ProductModel.countDocuments();
    const members = await MemberModel.countDocuments();

    const totalSales = await SaleModel.aggregate([
      {
        $match: {
          isReturned: false,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalCp = await SaleModel.aggregate([
      {
        $match: {
          isReturned: false,
        },
      },
      {
        $group: {
          _id: null,
          cp: { $sum: "$cp" },
        },
      },
    ]);

    console.log(totalCp);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: { members, categories, branches, products, totalSales: totalSales[0]?.totalAmount | 0, totalCp: totalCp[0].cp | 0 },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameter = req.query;
    // console.log("🚀 ~ getBranchStatHandler ~ queryParameter:", queryParameter);

    const products = await BranchInventoryModel.countDocuments(queryParameter);
    const members = await MemberModel.countDocuments();
    const categories = await CategoryModel.countDocuments();

    const totalSales1 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
    ]);
    console.log("🚀 ~ getBranchStatHandler ~ totalSales1:", totalSales1)

    const totalSales = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalCp = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
      {
        $group: {
          _id: null,
          cp: { $sum: "$cp" },
        },
      },
    ]);
    // console.log("🚀 ~ getBranchStatHandler ~ totalCp:", totalCp);

    const inventoryCount = await BranchInventoryModel.find(queryParameter).countDocuments();
    const inventories = await BranchInventoryModel.find(queryParameter).populate({ path: "product", select: "name , image , totalStock productId ,sku" });
    console.log("🚀 ~ getBranchStatHandler ~ inventories:", inventories);

    const totalSalesByMonth = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Grouping by month
          totalAmount: { $sum: "$totalAmount" }, // Calculating total sales revenue
        },
      },
    ]);
    console.log("🚀 ~ getBranchStatHandler ~ totalSalesByMonth:", totalSalesByMonth);

    const totalCpByMonth = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Grouping by month
          cp: { $sum: "$cp" }, // Calculating total cost price
        },
      },
    ]);
    console.log("🚀 ~ getBranchStatHandler ~ totalCpByMonth:", totalCpByMonth);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: { members, products, categories, totalSales: totalSales[0]?.totalAmount, inventories: inventories, inventoryCount: inventoryCount, totalCp: totalCp[0]?.cp | 0, totalSalesByMonth: totalSalesByMonth, totalCpByMonth: totalCpByMonth },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchProfitHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameter = req.query;
    const res1 = await SaleModel.find({ branch: queryParameter.branch, isReturned: false });

    const totalSales = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalCp = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          isReturned: false,
        },
      },
      {
        $group: {
          _id: null,
          cp: { $sum: "$cp" },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      totalSales: totalSales[0]?.totalAmount | 0,
      totalCp: totalCp[0]?.cp | 0,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
