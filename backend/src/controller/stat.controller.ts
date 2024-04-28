import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
import BranchInventoryModel from "../models/branchInventory.model";
import SaleModel from "../models/sale.model";
import mongoose from "mongoose";
var colors = require("colors");

export async function getHeadquarterStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const branches = await BranchModel.countDocuments({ type: { $ne: "headquarter" } }); // not include headquarter
    const categories = await CategoryModel.countDocuments();
    const products = await ProductModel.countDocuments();

    const totalStocksAvailable = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$availableStock" },
        },
      },
    ]);

    const totalSales = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalProduct: { $sum: "$quantity" },
        },
      },
    ]);

    const totalCp = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      msg: "Get all stat success",
      data: { categories, branches, products, totalSales: totalSales[0]?.totalAmount | 0, totalCp: totalCp[0]?.cp | 0, totalQuantitySold: totalSales[0]?.totalProduct | 0, totalAvailabeStock: totalStocksAvailable[0]?.totalStock | 0 },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameter = req.query;

    const products: any = await BranchInventoryModel.countDocuments(queryParameter);
    const categories: any = await CategoryModel.countDocuments();

    const totalQuantitySoldByBranch = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

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

    const totalCp = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
        },
      },
    ]);
    console.log("🚀 ~ getBranchStatHandler ~ totalCp:", totalCp);

    const inventoryCount = await BranchInventoryModel.find(queryParameter).countDocuments();
    const inventories = await BranchInventoryModel.find(queryParameter).populate({ path: "product", select: "name  image  totalStock productId sku" });

    // const totalSalesByMonth = await SaleModel.aggregate([
    //   {
    //     $match: {
    //       branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: { $month: "$createdAt" }, // Grouping by month
    //       totalAmount: {
    //         $sum: {
    //           $multiply: [
    //             { $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] }, // Subtract returned quantity from total quantity
    //             "$sp", // Multiply by selling price
    //           ],
    //         },
    //       },
    //     },
    //   },
    // ]);

    const totalCpByMonth1 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Grouping by month
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
        },
      },
    ]);

    // const totalCpByMonth = await SaleModel.aggregate([
    //   {
    //     $match: {
    //       branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
    //     },
    //   },
    //   {
    //     $project: {
    //       month: { $month: "$createdAt" },
    //       adjustedQuantity: { $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] },
    //       cp: 1, // Include cp in the projected document
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$month", // Grouping by month
    //       cp: { $sum: { $multiply: ["$cp", "$adjustedQuantity"] } }, // Calculating total cost price
    //     },
    //   },
    // ]);

    return res.status(200).json({
      status: "success",
      msg: "Get all stat success",
      data: {
        products,
        categories,
        totalSales: totalSales[0]?.totalAmount,
        inventories: inventories,
        inventoryCount: inventoryCount,
        totalCp: totalCp[0]?.cp | 0,
        // totalSalesByMonth: totalSalesByMonth,
        // totalCpByMonth: totalCpByMonth,
        totalQuantitySoldByBranch: totalQuantitySoldByBranch[0]?.totalQuantity | 0,
      },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchProfitHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameter = req.query;
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

    const totalCp = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      msg: "Get all data success",
      totalSales: totalSales[0]?.totalAmount | 0,
      totalCp: totalCp[0]?.cp | 0,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
