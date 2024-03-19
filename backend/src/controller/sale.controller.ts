import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateSaleInput, UpdateSaleInput } from "../schema/sale.schema";
import { findSale, createSale, findAllSale, findAndUpdateSale, deleteSale } from "../service/sale.service";
import BranchInventoryModel from "../models/branchInventory.model";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
var colors = require("colors");

export async function createSaleHandler(req: Request<{}, {}, CreateSaleInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    console.log("🚀 ~ createSaleHandler ~ body:", body);

    // Assuming body is an array of sale objects
    body.forEach(async (saleObject: any) => {
      const sale = await createSale(saleObject);
      const branchInventory: any = await BranchInventoryModel.findOne({ branch: saleObject.branch, product: saleObject.product });

      let updatedBranchInventory;
      if (branchInventory) {
        const newTotalstock = branchInventory.totalStock - saleObject.quantity; // Calculate new total stock
        updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { totalStock: newTotalstock }, { new: true });
      }

      console.log(updatedBranchInventory);
    });

    // Send response or perform additional operations after processing all sale objects
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
