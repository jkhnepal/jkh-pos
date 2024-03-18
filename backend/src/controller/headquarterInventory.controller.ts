import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateHeadquarterInventoryInput, UpdateHeadquarterInventoryInput } from "../schema/headquarterInventory.schema";
import { findHeadquarterInventory, createHeadquarterInventory, findAllHeadquarterInventory, findAndUpdateHeadquarterInventory, deleteHeadquarterInventory } from "../service/headquarterInventory.service";
var colors = require("colors");

export async function createHeadquarterInventoryHandler(req: Request<{}, {}, CreateHeadquarterInventoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findHeadquarterInventory({ product: body.product });

    if (alreadyExist) {
      next(new AppError(`Headquarter Inventory with the product (${body.product}) already exist`, 404));
      return;
    }

    const headquarterInventory = await createHeadquarterInventory(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: headquarterInventory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllHeadquarterInventoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    const results = await findAllHeadquarterInventory(queryParameters);
    return res.status(200).json({
      status: "success",
      msg: "Get all headquarterInventory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getHeadquarterInventoryHandler(req: Request<UpdateHeadquarterInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const headquarterInventoryId = req.params.headquarterInventoryId;
    const headquarterInventory = await findHeadquarterInventory({ headquarterInventoryId });

    if (!headquarterInventory) {
      next(new AppError("Headquarter Inventory does not exist", 404));
    }

    return res.status(200).json({
      status: "success",
      msg: "Get success",
      data: headquarterInventory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateHeadquarterInventoryHandler(req: Request<UpdateHeadquarterInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const headquarterInventoryId = req.params.headquarterInventoryId;
    const headquarterInventory: any = await findHeadquarterInventory({ headquarterInventoryId });

    if (!headquarterInventory) {
      next(new AppError("Headquarter Inventory does not exist", 404));
      return;
    }

    const updatedHeadquarterInventory = await findAndUpdateHeadquarterInventory({ headquarterInventoryId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedHeadquarterInventory,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteHeadquarterInventoryHandler(req: Request<UpdateHeadquarterInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const headquarterInventoryId = req.params.headquarterInventoryId;
    const headquarterInventory = await findHeadquarterInventory({ headquarterInventoryId });

    if (!headquarterInventory) {
      next(new AppError("Headquarter Inventory does not exist", 404));
      return;
    }

    await deleteHeadquarterInventory({ headquarterInventoryId });
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
