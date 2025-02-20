import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import BranchInventoryModel from "../models/branchInventory.model";
import SaleModel from "../models/sale.model";
import mongoose from "mongoose";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
import DistributeModel from "../models/distribute.model";
import InventoryModel from "../models/inventory.model";
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
          totalReturnedQuantity: { $sum: "$returnedQuantity" },
          totalDiscountGiven: {
            $sum: {
              $multiply: ["$discountAmount", { $subtract: ["$quantity", "$returnedQuantity"] }],
            },
          },
        },
      },
    ]);

    const totalreturnSales = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$sp", "$returnedQuantity"] } },
        },
      },
    ]);

    const totalCp = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } },
        },
      },
    ]);

    const totalReturnCp = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$cp", "$returnedQuantity"] } },
        },
      },
    ]);

    const totalSumOfRemainingStocks = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: { $multiply: ["$availableStock", "$cp"] } },
        },
      },
    ]);

    const top10SellingProducts = await SaleModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalQuantitySold: { $sum: "$quantity" },
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 1,
          productId: "$productDetails.productId",
          productName: "$productDetails.name",
          totalQuantitySold: 1,
        },
      },
    ]);

    const totalDistributedStock = await DistributeModel.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
        },
      },
    ]);

    // const totalAddedStock = await ProductModel.aggregate([
    //   {
    //     $group: {
    //       _id: null,
    //       totalStock: { $sum: "$totalAddedStock" },
    //     },
    //   },
    // ]);

    // console.log(totalDistributedStock[0]?.totalStock);

    // console.log(totalAddedStock[0]?.totalStock);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: {
        categories,
        branches,
        products,
        totalSales: totalSales[0]?.totalAmount | 0,
        totalCp: totalCp[0]?.cp | 0,
        totalQuantitySold: totalSales[0]?.totalProduct | 0,
        totalQuantityReturned: totalSales[0]?.totalReturnedQuantity | 0,
        totalAvailabeStock: totalStocksAvailable[0]?.totalStock | 0,
        totalreturnSale: totalreturnSales[0]?.totalAmount | 0,
        totalReturnCp: totalReturnCp[0]?.totalAmount | 0,
        totalDiscountGiven: totalSales[0]?.totalDiscountGiven | 0,
        InventoryValue: totalSumOfRemainingStocks[0]?.totalStock,
        top10SellingProducts,
        totalDistributedStock: totalDistributedStock[0]?.totalStock | 0,
      },
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
          totalReturnedQuantity: { $sum: "$returnedQuantity" },
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

    const totalreturnSales = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },

      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$sp", "$returnedQuantity"] } },
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
          // cp: { $sum: "$cp" },
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } },
        },
      },
    ]);

    const totalReturnCp = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$cp", "$returnedQuantity"] } },
        },
      },
    ]);

    const inventoryCount = await BranchInventoryModel.find(queryParameter).countDocuments();
    const inventories = await BranchInventoryModel.find(queryParameter).populate({ path: "product", select: "name  image  totalStock productId sku" });

    const totalSalesByMonth = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Grouping by month
          totalAmount: {
            $sum: {
              $multiply: [{ $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] }, "$sp"],
            },
          },
        },
      },
    ]);

    const totalCpByMonth = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          adjustedQuantity: { $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] },
          cp: 1, // Include cp in the projected document
        },
      },
      {
        $group: {
          _id: "$month", // Grouping by month
          cp: { $sum: { $multiply: ["$cp", "$adjustedQuantity"] } },
        },
      },
    ]);

    console.log();

    const test = await BranchInventoryModel.find(queryParameter);

    console.log(test);

    const totalSumOfRemainingStocks = await BranchInventoryModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $lookup: {
          from: "products", // The name of the products collection
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: { $multiply: ["$totalStock", "$productDetails.cp"] } },
        },
      },
    ]);

    // console.log(totalSumOfRemainingStocks);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: {
        products,
        categories,
        totalSales: totalSales[0]?.totalAmount,
        inventories: inventories,
        inventoryCount: inventoryCount,
        totalCp: totalCp[0]?.cp | 0,
        totalSalesByMonth: totalSalesByMonth,
        totalCpByMonth: totalCpByMonth,
        totalQuantitySoldByBranch: totalQuantitySoldByBranch[0]?.totalQuantity | 0,
        totalReturnedQuantity: totalQuantitySoldByBranch[0]?.totalReturnedQuantity | 0,
        totalreturnSale: totalreturnSales[0]?.totalAmount | 0,
        totalReturnCp: totalReturnCp[0]?.totalAmount | 0,
        totalSumOfRemainingStocks: totalSumOfRemainingStocks[0]?.totalStockValue,
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

    const sales = await SaleModel.find(queryParameter);
    console.log("🚀 ~ getBranchProfitHandler ~ sales:", sales);

    const totalSales = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },

      // {
      //   $group: {
      //     _id: null,
      //     totalAmount: {
      //       $sum: {
      //         $multiply: [
      //           "$soldAt",
      //           { $subtract: ["$quantity", "$returnedQuantity"] } // soldAt * (quantity - returnedQuantity)
      //         ]
      //       }
      //     }
      //   },
      // },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $multiply: [
                "$soldAt",
                { $subtract: ["$quantity", "$returnedQuantity"] }, // soldAt * (quantity - returnedQuantity)
              ],
            },
          },
          totalCost: {
            $sum: {
              $multiply: [
                "$cp",
                { $subtract: ["$quantity", "$returnedQuantity"] }, // cp * (quantity - returnedQuantity)
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalCost: 1,
          totalProfit: {
            $subtract: ["$totalAmount", "$totalCost"], // totalProfit = totalAmount - totalCost
          },
        },
      },
    ]);

    const totalReturnedDiscount = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$discountAmount", "$returnedQuantity"] } },
        },
      },
    ]);

    const totalSalesAfterDiscount = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },

      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmountAfterDiscount" },
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
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } },
        },
      },
    ]);

    const totalDiscountAmount1 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },

      {
        $group: {
          _id: null,
          discountAmount: { $sum: { $multiply: ["$discountAmount", "$quantity"] } },
        },
      },
    ]);

    const totalDiscountAmount2 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },

      {
        $group: {
          _id: null,
          discountAmount: { $sum: { $multiply: ["$discountAmount", "$returnedQuantity"] } },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      totalSales: totalSales[0]?.totalAmount | 0,
      totalProfit: totalSales[0]?.totalProfit | 0,
      totalSalesAfterDiscount: totalSalesAfterDiscount[0]?.totalAmount | 0,
      totalCp: totalCp[0]?.cp | 0,
      totalReturnedDiscountAmount: totalReturnedDiscount[0]?.totalAmount | 0,
      totalDiscountAmount: (totalDiscountAmount1[0]?.discountAmount - totalDiscountAmount2[0]?.discountAmount) | 0,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
