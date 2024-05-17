import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { findAndUpdateBranchInventory, findBranchInventory } from "../service/branchInventory.service";
import BranchInventoryModel from "../models/branchInventory.model";
import { findAndUpdateProduct } from "../service/product.service";
import { CreateReturnToHeadquarterInput } from "../schema/returnToHeadquarter.schema";
import { createReturnToHeadquarter, findAllReturnHistory } from "../service/returnToHeadquarter.service";
var colors = require("colors");

export async function createReturnToHeadquarterHandler(req: Request<{}, {}, CreateReturnToHeadquarterInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const productInventory = await findBranchInventory({ branchInventoryId: body.branchInventoryId });
    if (!productInventory) {
      return res.status(400).json({
        status: "failure",
        msg: "Product not found in inventory",
      });
    }

    if (body.returnedQuantity <= 0) {
      return res.status(400).json({
        status: "failure",
        msg: "Returned quantity must be greater than 0",
      });
    }

    // Cannot return to headquarter if the returned quantity is greater than the available stock
    if (productInventory) {
      if (body.returnedQuantity > productInventory.totalStock) {
        return res.status(400).json({
          status: "failure",
          msg: "Not enough stock to return to headquarter",
        });
      }
    }

    const returnToHeadquarter = await createReturnToHeadquarter(body);

    await findAndUpdateProduct({ _id: body.product }, { $inc: { availableStock: +body.returnedQuantity } }, { new: true });
    const branchInventory: any = await BranchInventoryModel.findOne({ branch: body.branch, product: body.product });

    let updatedBranchInventory;
    if (branchInventory) {
      updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { $inc: { totalStock: -body.returnedQuantity, totalReturnedStockToHeadquarter: +body.returnedQuantity } }, { new: true });
    }

    return res.status(201).json({
      status: "success",
      msg: "Return success",
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function resetDatabaseAfter3MonthHandler(req: any, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;

    const branchInventories = await BranchInventoryModel.find({
      branch: branchId,
    });
    for (const inventory of branchInventories) {
      inventory.previousStock = inventory.totalStock;
      await inventory.save();
    }

    return res.json({
      status: "success",
      msg: "Database reset success",
      data: {},
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllReturnHistory(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    const results = await findAllReturnHistory(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all return history success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
