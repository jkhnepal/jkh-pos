import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import BranchInventoryModel from "../models/branchInventory.model";
import { CreateReturnInput, UpdateReturnInput } from "../schema/return.schema";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import { createReturn, findAllReturn, findReturn, findAndUpdateReturn, deleteReturn } from "../service/return.service";
var colors = require("colors");

export async function createReturnHandler(req: Request<{}, {}, CreateReturnInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;

    const category = await createReturn(body);










    // body.forEach(async (returnHistoryObject: any) => {
    //   const returnHistory = await createReturn(returnHistoryObject);
    //   const branchInventory: any = await BranchInventoryModel.findOne({ branch: returnHistoryObject.branch, product: returnHistoryObject.product });

    //   let updatedBranchInventory;
    //   if (branchInventory) {
    //     const newTotalstock = branchInventory.totalStock - returnHistoryObject.quantity;
    //     updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { totalStock: newTotalstock }, { new: true });
    //   }

    //   return res.status(201).json({
    //     status: "success",
    //     msg: "returnHistorys created success",
    //     data: updatedBranchInventory,
    //   });
      
    // });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllReturnHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    const results = await findAllReturn(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all returnHistory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getReturnHandler(req: Request<UpdateReturnInput["params"]>, res: Response, next: NextFunction) {
  try {
    const returnId = req.params.returnId;
    const returnHistory = await findReturn({ returnId });

    if (!returnHistory) {
      next(new AppError("returnHistory does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: returnHistory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateReturnHandler(req: Request<UpdateReturnInput["params"]>, res: Response, next: NextFunction) {
  try {
    const returnId = req.params.returnId;
    const returnHistory: any = await findReturn({ returnId });

    if (!returnHistory) {
      next(new AppError("Return does not exist", 404));
      return;
    }

    const updatedReturn = await findAndUpdateReturn({ returnId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedReturn,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteReturnHandler(req: Request<UpdateReturnInput["params"]>, res: Response, next: NextFunction) {
  try {
    const returnId = req.params.returnId;
    const returnHistory = await findReturn({ returnId });

    if (!returnHistory) {
      next(new AppError("returnHistory does not exist", 404));
      return;
    }

    await deleteReturn({ returnId });
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
