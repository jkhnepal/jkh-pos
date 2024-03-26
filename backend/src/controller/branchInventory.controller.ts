import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateBranchInventoryInput, UpdateBranchInventoryInput } from "../schema/branchInventory.schema";
import { findBranchInventory, createBranchInventory, findAllBranchInventory, findAndUpdateBranchInventory, deleteBranchInventory } from "../service/branchInventory.service";
var colors = require("colors");

export async function createBranchInventoryHandler(req: Request<{}, {}, CreateBranchInventoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findBranchInventory({ product: body.product });

    if (alreadyExist) {
      next(new AppError(`Branch Inventory with the product (${body.product}) already exist`, 404));
      return;
    }

    const branchInventory = await createBranchInventory(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: branchInventory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}


export async function getAllBranchInventoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    const results = await findAllBranchInventory(queryParameters);
    return res.status(200).json({
      status: "success",
      msg: "Get all branchInventory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchInventoryHandler(req: Request<UpdateBranchInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchInventoryId = req.params.branchInventoryId;
    const branchInventory = await findBranchInventory({ branchInventoryId });

    if (!branchInventory) {
      next(new AppError("Branch Inventory does not exist", 404));
    }

    return res.status(200).json({
      status: "success",
      msg: "Get success",
      data: branchInventory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateBranchInventoryHandler(req: Request<UpdateBranchInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchInventoryId = req.params.branchInventoryId;
    const branchInventory: any = await findBranchInventory({ branchInventoryId });

    if (!branchInventory) {
      next(new AppError("Branch Inventory does not exist", 404));
      return;
    }

    const updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedBranchInventory,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteBranchInventoryHandler(req: Request<UpdateBranchInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchInventoryId = req.params.branchInventoryId;
    const branchInventory = await findBranchInventory({ branchInventoryId });

    if (!branchInventory) {
      next(new AppError("Branch Inventory does not exist", 404));
      return;
    }

    await deleteBranchInventory({ branchInventoryId });
    return res.status(200).json({
      status: "success",
      msg: "Delete success",
      data: {},
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
