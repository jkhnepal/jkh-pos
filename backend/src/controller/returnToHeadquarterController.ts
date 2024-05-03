import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import BranchInventoryModel from "../models/branchInventory.model";
import { findAndUpdateProduct } from "../service/product.service";
import { CreateReturnToHeadquarterInput } from "../schema/returnToHeadquarter.schema";
import { createReturnToHeadquarter, findAllReturnHistory } from "../service/returnToHeadquarter.service";
import { deleteDistribute } from "../service/distribute.service";
import DistributeModel from "../models/distribute.model";
import SaleModel from "../models/sale.model";
import ReturnModel from "../models/return.model";

var colors = require("colors");

export async function createReturnToHeadquarterHandler(req: Request<{}, {}, CreateReturnToHeadquarterInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const returnToHeadquarter = await createReturnToHeadquarter(body);

    //incerement the available stock of the product of headquarter
    const updatedProduct = await findAndUpdateProduct({ _id: body.product }, { $inc: { availableStock: +body.returnedQuantity } }, { new: true });

    //decrement the total stock of the product of the branch
    const branchInventory: any = await BranchInventoryModel.findOne({ branch: body.branch, product: body.product });

    let updatedBranchInventory;
    if (branchInventory) {
      updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { $inc: { totalStock: -body.returnedQuantity } }, { new: true });
    }

    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: returnToHeadquarter,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

// export async function resetDatabaseAfter3MonthHandler(req: any, res: Response, next: NextFunction) {
//   try {
//     const res1 = await DistributeModel.deleteMany();
//     const res2 = await SaleModel.deleteMany();

//     return res.json({
//       status: "success",
//       msg: "Database reset success",
//       data: {},
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }
export async function resetDatabaseAfter3MonthHandler(req: any, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;
    console.log(branchId);
    // Delete all documents from DistributeModel
    // const res1 = await DistributeModel.deleteMany();

    // Delete all documents from SaleModel
    const res2 = await SaleModel.deleteMany({
      branch: branchId,
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
