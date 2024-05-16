// import { NextFunction, Request, Response } from "express";
// import AppError from "../utils/appError";
// import CategoryModel from "../models/category.model";
// import BranchModel from "../models/branch.model";
// import ProductModel from "../models/product.model";
// import BranchInventoryModel from "../models/branchInventory.model";
// import SaleModel from "../models/sale.model";
// import mongoose from "mongoose";
// var colors = require("colors");

// export async function getHeadquarterStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const branches = await BranchModel.countDocuments({ type: { $ne: "headquarter" } }); // not include headquarter
//     const categories = await CategoryModel.countDocuments();
//     const products = await ProductModel.countDocuments();

//     const totalStocksAvailable = await ProductModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalStock: { $sum: "$availableStock" },
//         },
//       },
//     ]);

//     const totalSales = await SaleModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$totalAmount" },
//           totalProduct: { $sum: "$quantity" },
//         },
//       },
//     ]);

//     const totalCp = await SaleModel.aggregate([
//       {
//         $group: {
//           _id: null,
//           cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
//         },
//       },
//     ]);

//     return res.status(200).json({
//       status: "success",
//       msg: "Get all stat success",
//       data: { categories, branches, products, totalSales: totalSales[0]?.totalAmount | 0, totalCp: totalCp[0]?.cp | 0, totalQuantitySold: totalSales[0]?.totalProduct | 0, totalAvailabeStock: totalStocksAvailable[0]?.totalStock | 0 },
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function getBranchStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const queryParameter = req.query;

//     const products: any = await BranchInventoryModel.countDocuments(queryParameter);
//     const categories: any = await CategoryModel.countDocuments();

//     const totalQuantitySoldByBranch = await SaleModel.aggregate([
//       {
//         $match: {
//           branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalQuantity: { $sum: "$quantity" },
//         },
//       },
//     ]);

//     const totalSales = await SaleModel.aggregate([
//       {
//         $match: {
//           branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     const totalCp = await SaleModel.aggregate([
//       {
//         $match: {
//           branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
//         },
//       },
//     ]);
//     console.log("🚀 ~ getBranchStatHandler ~ totalCp:", totalCp);

//     const inventoryCount = await BranchInventoryModel.find(queryParameter).countDocuments();
//     const inventories = await BranchInventoryModel.find(queryParameter).populate({ path: "product", select: "name  image  totalStock productId sku" });

//     // const totalSalesByMonth = await SaleModel.aggregate([
//     //   {
//     //     $match: {
//     //       branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//     //     },
//     //   },
//     //   {
//     //     $group: {
//     //       _id: { $month: "$createdAt" }, // Grouping by month
//     //       totalAmount: {
//     //         $sum: {
//     //           $multiply: [
//     //             { $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] }, // Subtract returned quantity from total quantity
//     //             "$sp", // Multiply by selling price
//     //           ],
//     //         },
//     //       },
//     //     },
//     //   },
//     // ]);

//     const totalCpByMonth1 = await SaleModel.aggregate([
//       {
//         $match: {
//           branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" }, // Grouping by month
//           cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
//         },
//       },
//     ]);

//     // const totalCpByMonth = await SaleModel.aggregate([
//     //   {
//     //     $match: {
//     //       branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//     //     },
//     //   },
//     //   {
//     //     $project: {
//     //       month: { $month: "$createdAt" },
//     //       adjustedQuantity: { $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] },
//     //       cp: 1, // Include cp in the projected document
//     //     },
//     //   },
//     //   {
//     //     $group: {
//     //       _id: "$month", // Grouping by month
//     //       cp: { $sum: { $multiply: ["$cp", "$adjustedQuantity"] } }, // Calculating total cost price
//     //     },
//     //   },
//     // ]);

//     return res.status(200).json({
//       status: "success",
//       msg: "Get all stat success",
//       data: {
//         products,
//         categories,
//         totalSales: totalSales[0]?.totalAmount,
//         inventories: inventories,
//         inventoryCount: inventoryCount,
//         totalCp: totalCp[0]?.cp | 0,
//         // totalSalesByMonth: totalSalesByMonth,
//         // totalCpByMonth: totalCpByMonth,
//         totalQuantitySoldByBranch: totalQuantitySoldByBranch[0]?.totalQuantity | 0,
//       },
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function getBranchProfitHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const queryParameter = req.query;
//     const totalSales = await SaleModel.aggregate([
//       {
//         $match: {
//           branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     const totalCp = await SaleModel.aggregate([
//       {
//         $match: {
//           branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
//         },
//       },
//     ]);

//     return res.status(200).json({
//       status: "success",
//       msg: "Get all data success",
//       totalSales: totalSales[0]?.totalAmount | 0,
//       totalCp: totalCp[0]?.cp | 0,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import BranchInventoryModel from "../models/branchInventory.model";
import { CreateReturnInput, UpdateReturnInput } from "../schema/return.schema";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import { createReturn, findAllReturn, findReturn, findAndUpdateReturn, deleteReturn } from "../service/return.service";
import { findAndUpdateSale, findSale } from "../service/sale.service";
import SaleModel from "../models/sale.model";
import mongoose from "mongoose";
import CategoryModel from "../models/category.model";
import BranchModel from "../models/branch.model";
import ProductModel from "../models/product.model";
var colors = require("colors");

export async function getHeadquarterStatHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const branches = await BranchModel.countDocuments({ type: { $ne: "headquarter" } }); // not include headquarter
    const categories = await CategoryModel.countDocuments();
    const products = await ProductModel.countDocuments();
    // const members = await MemberModel.countDocuments();

    const totalStocksAvailable = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$availableStock" },
        },
      },
    ]);

    // const totalSales1 = await SaleModel.find();
    // console.log("🚀 ~ getHeadquarterStatHandler ~ totalSales1:", totalSales1);

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
          // totalAmount: { $sum: "$totalAmount" },
          // totalProduct: { $sum: "$quantity" },
          totalAmount: { $sum: { $multiply: ["$sp", "$returnedQuantity"] } }, // Use $multiply
        },
      },
    ]);
    console.log("🚀 ~ getHeadquarterStatHandler ~ totalreturns:", totalreturnSales[0]?.totalAmount);

    const totalCp = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          // cp: { $sum: "$cp" },
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
        },
      },
    ]);

    const totalReturnCp = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$cp", "$returnedQuantity"] } }, // Use $multiply
        },
      },
    ]);

    console.log(totalCp);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: { categories, branches, products, totalSales: totalSales[0]?.totalAmount | 0, totalCp: totalCp[0]?.cp | 0, totalQuantitySold: totalSales[0]?.totalProduct | 0, totalQuantityReturned: totalSales[0]?.totalReturnedQuantity | 0, totalAvailabeStock: totalStocksAvailable[0]?.totalStock | 0, totalreturnSale: totalreturnSales[0]?.totalAmount | 0, totalReturnCp: totalReturnCp[0]?.totalAmount | 0 , totalDiscountGiven: totalSales[0]?.totalDiscountGiven | 0},
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

    const products: any = await BranchInventoryModel.countDocuments(queryParameter);
    // const members = await MemberModel.countDocuments();
    const categories: any = await CategoryModel.countDocuments();

    // const ress= await SaleModel.find({ branch: queryParameter.branch, });
    // console.log("🚀 ~ getBranchStatHandler ~ ress:", ress)

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
          // totalSoldQuantity: { $subtract: ["$totalQuantity1", "$totalReturnedQuantity"] },
        },
      },
    ]);

    console.log(totalQuantitySoldByBranch, "totalQuantitySoldByBranch");

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
          // totalAmount: { $sum: "$totalAmount" },
          // totalProduct: { $sum: "$quantity" },
          totalAmount: { $sum: { $multiply: ["$sp", "$returnedQuantity"] } }, // Use $multiply
        },
      },
    ]);

    const totalCp1 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
    ]);
    console.log("🚀 ~ getBranchStatHandler ~ totalCp1:", totalCp1);

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
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
        },
      },
    ]);
    console.log("🚀 ~ getBranchStatHandler ~ totalCp:", totalCp);

    const totalReturnCp = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$cp", "$returnedQuantity"] } }, // Use $multiply
        },
      },
    ]);
    // console.log("🚀 ~ getBranchStatHandler ~ totalCp:", totalCp);

    const inventoryCount = await BranchInventoryModel.find(queryParameter).countDocuments();
    const inventories = await BranchInventoryModel.find(queryParameter).populate({ path: "product", select: "name  image  totalStock productId sku" });
    // console.log("🚀 ~ getBranchStatHandler ~ inventories:", inventories);

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
              $multiply: [
                { $subtract: ["$quantity", { $ifNull: ["$returnedQuantity", 0] }] }, // Subtract returned quantity from total quantity
                "$sp", // Multiply by selling price
              ],
            },
          },
        },
      },
    ]);

    // console.log("🚀 ~ getBranchStatHandler ~ totalSalesByMonth:", totalSalesByMonth);

    const totalCpByMonth1 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Grouping by month
          // cp: { $sum: "$cp" }, // Calculating total cost price
          cp: { $sum: { $multiply: ["$cp", "$quantity"] } }, // Use $multiply
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
          cp: { $sum: { $multiply: ["$cp", "$adjustedQuantity"] } }, // Calculating total cost price
        },
      },
    ]);

    //console.log("🚀 ~ getBranchStatHandler ~ totalCpByMonth:", totalCpByMonth);

    return res.status(200).json({
      status: "success",
      msg: "Get all member success",
      data: {
        // members,
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

    const totalReturnedDiscount = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
        },
      },
      {
        $group: {
          _id: null,
          // totalAmount: { $sum: "$totalAmount" },
          // totalAmount: { $sum: "$totalAmount" },
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

    // const totalSalesAfterDiscount = await SaleModel.aggregate([
    //   {
    //     $match: {
    //       branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalAmount: { $sum: "$totalAmountAfterDiscount" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       totalAmount: 1,
    //       totalAmountAfterSubtraction: {
    //         $subtract: [
    //           "$totalAmount",
    //           { $multiply: ["$returnedQuantity", "$discountAmount"] }
    //         ]
    //       }
    //     }
    //   }
    // ]);

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

    const totalDiscountAmount1 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          // returnedQuantity: { $lt: 1 }
        },
      },

      {
        $group: {
          _id: null,
          // discountAmount: { $sum: "$totalDiscountAmount" },
          discountAmount: { $sum: { $multiply: ["$discountAmount", "$quantity"] } },
        },
      },
    ]);

    const totalDiscountAmount2 = await SaleModel.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(queryParameter.branch as string),
          // returnedQuantity: { $lt: 1 }
        },
      },

      {
        $group: {
          _id: null,
          // discountAmount: { $sum: "$totalDiscountAmount" },
          discountAmount: { $sum: { $multiply: ["$discountAmount", "$returnedQuantity"] } },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      totalSales: totalSales[0]?.totalAmount | 0,
      totalSalesAfterDiscount: totalSalesAfterDiscount[0]?.totalAmount | 0,
      totalCp: totalCp[0]?.cp | 0,
      // totalDiscountAmount: totalDiscountAmount[0]?.discountAmount | 0,
      totalReturnedDiscountAmount: totalReturnedDiscount[0]?.totalAmount | 0,
      totalDiscountAmount: (totalDiscountAmount1[0]?.discountAmount - totalDiscountAmount2[0]?.discountAmount) | 0,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
