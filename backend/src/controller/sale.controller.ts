import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateSaleInput, UpdateSaleInput } from "../schema/sale.schema";
import { findSale, createSale, findAllSale, findAndUpdateSale, deleteSale } from "../service/sale.service";
import BranchInventoryModel from "../models/branchInventory.model";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import SaleModel from "../models/sale.model";
var colors = require("colors");

export async function createSaleHandler(req: Request<{}, {}, CreateSaleInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body: any = req.body;
    console.log(body);

    // sale objects comes in array so i am using loop with promise
    let updatedBranchInventory;
    await Promise.all(
      body.selectedProducts.map(async (saleObject: any) => {
        const sale = await createSale(saleObject);
        const branchInventory: any = await BranchInventoryModel.findOne({ branch: saleObject.branch, product: saleObject.product });

        if (branchInventory) {
          const newTotalstock = branchInventory.totalStock - saleObject.quantity;
          updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { totalStock: newTotalstock }, { new: true });
        }
      })
    );

    return res.status(201).json({
      status: "success",
      msg: "sales created success",
      updatedBranchInventory: updatedBranchInventory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllSaleHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    const results = await findAllSale(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all sale success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

// export async function getAllSaleByMonthHandler(req: any, res: Response, next: NextFunction) {
//   try {
//     const branchId = req.params.branchId;
//     console.log(branchId);

//     const results = await findAllSale();
//     return res.json({
//       status: "success",
//       msg: "Get all sale success",
//       data: results,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function getAllSaleByMonthHandler(req: any, res: Response, next: NextFunction) {
//   try {
//     const branchId = req.params.branchId;
//     console.log(branchId);

//     // Fetch all sales
//     const allSales: any = await SaleModel.find();

//     // Filter sales by branchId
//     // const branchSales: any = allSales.filter((sale: any) => sale.branch === branchId);
//     // const branchSales: await findAllSale();
//     const branchSales=await SaleModel.find({
//       branch: branchId,
//     });

//     // Group sales by month
//     const salesByMonth = groupSalesByMonth(branchSales);
//     console.log(salesByMonth);

//     return res.json({
//       status: "success",
//       msg: "Get all sale success",
//       data: salesByMonth,
//     });

//   } catch (error: any) {
//     console.error("msg:", error.message);
//     next(new AppError("Internal server error", 500));
//   }
// }

// // Function to group sales by month
// function groupSalesByMonth(sales:any) {
//   const salesByMonth: any = {};

//   sales.forEach((sale:any) => {
//     const date = new Date(sale.createdAt); // Assuming there's a date property in your sale object
//     const month = date.getMonth() + 1; // Month is 0-indexed, so adding 1 to get actual month
//     const year = date.getFullYear();

//     const key = `${year}-${month}`;
//     if (!salesByMonth[key]) {
//       salesByMonth[key] = [];
//     }
//     salesByMonth[key].push(sale);
//   });

//   return salesByMonth;
// }

export async function getAllSaleByMonthHandler(req: any, res: Response, next: NextFunction) {
  try {
    console.log(req.params);
    const branchId = req.params.branchId;
    console.log(branchId);

    // Fetch all sales
    const allSales: any = await SaleModel.find();

    // Filter sales by branchId
    const branchSales = await SaleModel.find({ branch: branchId });

    // Group sales by month
    const salesByMonth = groupSalesByMonth(branchSales);
    console.log(salesByMonth);

    // Convert object to array
    const salesByMonthArray = Object.entries(salesByMonth).map(([key, value]) => ({ month: key, sales: value }));

    return res.json({
      status: "success",
      msg: "Get all sale success",
      data: salesByMonthArray,
    });
  } catch (error: any) {
    console.error("msg:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

// Function to group sales by month
function groupSalesByMonth(sales: any) {
  const salesByMonth: any = {};

  sales.forEach((sale: any) => {
    const date = new Date(sale.createdAt);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const key = `${year}-${month}`;
    if (!salesByMonth[key]) {
      salesByMonth[key] = [];
    }
    salesByMonth[key].push(sale);
  });

  return salesByMonth;
}

export async function getSaleHandler(req: Request<UpdateSaleInput["params"]>, res: Response, next: NextFunction) {
  try {
    const saleId = req.params.saleId;
    const sale = await findSale({ saleId });

    if (!sale) {
      next(new AppError("sale does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: sale,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateSaleHandler(req: Request<UpdateSaleInput["params"]>, res: Response, next: NextFunction) {
  try {
    const saleId = req.params.saleId;
    const sale: any = await findSale({ saleId });

    if (!sale) {
      next(new AppError("Sale does not exist", 404));
      return;
    }

    const updatedSale = await findAndUpdateSale({ saleId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedSale,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteSaleHandler(req: Request<UpdateSaleInput["params"]>, res: Response, next: NextFunction) {
  try {
    const saleId = req.params.saleId;
    const sale = await findSale({ saleId });

    if (!sale) {
      next(new AppError("sale does not exist", 404));
      return;
    }

    await deleteSale({ saleId });
    return res.json({
      status: "success",
      msg: "Delete success",
      data: {},
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

// export async function deleteSalesByMonthHandler(req: any, res: Response, next: NextFunction) {
//   try {
//     const { year, month } = req.params; // Extract year and month from request parameters
//     const startDate = new Date(`${year}-${month}-01`);
//     const endDate = new Date(`${year}-${month + 1}-01`); // Get the start and end dates of the specified month

//     // Delete sales data for the specified month
//     const result = await SaleModel.deleteMany({
//       createdAt: { $gte: startDate, $lt: endDate }
//     });

//     return res.json({
//       status: "success",
//       msg: `Deleted ${result.deletedCount} sales records for month ${year}-${month}`,
//       data: null,
//     });
//   } catch (error: any) {
//     console.error("msg:", error.message);
//     next(new AppError("Internal server error", 500));
//   }
// }

export async function deleteSalesByMonthHandler(req: any, res: Response, next: NextFunction) {
  try {
    const { branchId, date } = req.params;

    const year = parseInt(date.split("-")[0]);
    const month = parseInt(date.split("-")[1]);

    const result = await SaleModel.deleteMany({
      branch: branchId,
      $expr: {
        $and: [{ $eq: [{ $year: "$createdAt" }, year] }, { $eq: [{ $month: "$createdAt" }, month] }],
      },
    });

    return res.json({
      status: "success",
      msg: "Sales deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("msg:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function getSalesByBranchAndDateHandler(req: any, res: Response, next: NextFunction) {
  try {
    const { branchId, date } = req.params;

    const [year, month] = date.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1); // Month in JavaScript is 0-indexed, so we subtract 1
    const endDate = new Date(year, month, 0);

    const sales = await SaleModel.find({
      branch: branchId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate({
      path: "product",
      select: "name image cp sp ",
    });

    return res.json({
      status: "success",
      msg: "Sales fetched successfully",
      data: sales,
    });
  } catch (error: any) {
    console.error("msg:", error.message);
    next(new AppError("Internal server error", 500));
  }
}
