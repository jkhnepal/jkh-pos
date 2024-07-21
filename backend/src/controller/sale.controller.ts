import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateSaleInput, UpdateSaleInput } from "../schema/sale.schema";
import { findSale, createSale, findAllSale, findAndUpdateSale, deleteSale } from "../service/sale.service";
import BranchInventoryModel from "../models/branchInventory.model";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import SaleModel from "../models/sale.model";
import ReturnModel from "../models/return.model";
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

export async function getAllSaleByMonthHandler(req: any, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;
    const branchSales = await SaleModel.find({ branch: branchId });

    // Calculate total sales amount amount  for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const result = await SaleModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSalesAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalSalesAmountOfToday = result.length > 0 ? result[0].totalSalesAmount : 0;

    const adjustedSales = branchSales.map((sale: any) => {
      const quantityAfterReturn = sale.quantity - sale.returnedQuantity;
      return {
        _id: sale._id,
        branch: sale.branch,
        product: sale.product,
        quantity: sale.quantity,
        quantityAfterReturn: sale.quantity - sale.returnedQuantity,
        cp: sale.cp,
        sp: sale.sp,
        totalAmount: sale.totalAmount,
        discountAmount: sale.discountAmount,
        returnedQuantity: sale.returnedQuantity,
        invoiceNo: sale.invoiceNo,
        totalAmountAfterReturn: sale.totalAmount - sale.sp * sale.returnedQuantity,
        memberName: sale.memberName,
        memberPhone: sale.memberPhone,
        saleId: sale.saleId,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        __v: sale.__v,
      };
    });

    const groupSalesByMonth = (sales: any[]) => {
      return sales.reduce((acc, sale) => {
        const month = sale.createdAt.toISOString().slice(0, 7); // Extract year-month in format YYYY-MM
        if (!acc[month]) acc[month] = [];
        acc[month].push(sale);
        return acc;
      }, {} as { [key: string]: any[] });
    };

    const salesByMonth = groupSalesByMonth(adjustedSales);

    // Convert object to array
    const salesByMonthArray = Object.entries(salesByMonth).map(([key, value]) => ({ month: key, sales: value }));

    // Sort by month in descending order
    salesByMonthArray.sort((a, b) => b.month.localeCompare(a.month));
    return res.json({
      status: "success",
      msg: "Get all sale success",
      data: { salesByMonthArray, totalSalesAmountOfToday },
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

    const result1 = await ReturnModel.deleteMany({
      branch: branchId,
      $expr: {
        $and: [{ $eq: [{ $year: "$createdAt" }, year] }, { $eq: [{ $month: "$createdAt" }, month] }],
      },
    });

    // Replace previousStock with totalStock for each document in BranchInventoryModel
    const branchInventories = await BranchInventoryModel.find({
      branch: branchId,
    });
    for (const inventory of branchInventories) {
      inventory.previousStock = inventory.totalStock;
      await inventory.save();
    }
    console.log(branchInventories);

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
    })
      .populate({
        path: "product",
        select: "name image cp sp ",
      })
      .sort({ createdAt: -1 });

    const adjustedSales = sales.map((sale: any) => {
      const quantityAfterReturn = sale.quantity - sale.returnedQuantity;
      return {
        _id: sale._id,
        branch: sale.branch,
        product: sale.product,
        quantity: sale.quantity,
        quantityAfterReturn: sale.quantity - sale.returnedQuantity,
        cp: sale.cp,
        sp: sale.sp,
        totalAmount: sale.totalAmount,
        returnedQuantity: sale.returnedQuantity,
        discountAmount: sale.discountAmount,
        invoiceNo: sale.invoiceNo,
        totalAmountAfterReturn: sale.totalAmount - sale.sp * sale.returnedQuantity,
        memberName: sale.memberName,
        memberPhone: sale.memberPhone,
        saleId: sale.saleId,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        __v: sale.__v,
      };
    });

    return res.json({
      status: "success",
      msg: "Sales fetched successfully",
      data: adjustedSales,
    });
  } catch (error: any) {
    console.error("msg:", error.message);
    next(new AppError("Internal server error", 500));
  }
}
