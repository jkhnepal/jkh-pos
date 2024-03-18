import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateInventoryInput, UpdateInventoryInput } from "../schema/inventory.schema";
import { findInventory, createInventory, findAllInventory, findAndUpdateInventory, deleteInventory, getTotalAddedStock } from "../service/inventory.service";
import { getTotalDistributedStock } from "../service/distribute.service";
import { findAndUpdateHeadquarterInventory, findHeadquarterInventory } from "../service/headquarterInventory.service";
var colors = require("colors");

export async function createInventoryHandler(req: Request<{}, {}, CreateInventoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;

    const inventory = await createInventory(body);
    const headquarterInventory = await findHeadquarterInventory({ product: req.body.product });

    let updatedHeadquarterInventory;
    if (headquarterInventory) {
      const newTotalstock = (headquarterInventory.stock += body.stock);
      updatedHeadquarterInventory = await findAndUpdateHeadquarterInventory({ headquarterInventoryId: headquarterInventory?.headquarterInventoryId }, { stock: newTotalstock }, { new: true });
    }

    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: { inventory, updatedHeadquarterInventory },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllInventoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    console.log(queryParameters);

    const results = await findAllInventory(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all inventory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getInventoryHandler(req: Request<UpdateInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const inventoryId = req.params.inventoryId;
    const inventory = await findInventory({ inventoryId });

    if (!inventory) {
      next(new AppError("inventory does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: inventory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateInventoryHandler(req: Request<UpdateInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const inventoryId = req.params.inventoryId;
    const inventory = await findInventory({ inventoryId });
    const headquarterInventory = await findHeadquarterInventory({ product: inventory?.product });

    if (!inventory) {
      next(new AppError("Inventory does not exist", 404));
      return;
    }

    const updatedInventory = await findAndUpdateInventory({ inventoryId }, req.body, {
      new: true,
    });

    let updatedHeadquarterInventory;
    if (headquarterInventory) {
      const newTotalstock = (headquarterInventory.stock += req.body.stock -= inventory.stock);
      updatedHeadquarterInventory = await findAndUpdateHeadquarterInventory({ headquarterInventoryId: headquarterInventory?.headquarterInventoryId }, { stock: newTotalstock }, { new: true });
    }

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedInventory,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteInventoryHandler(req: Request<UpdateInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const inventoryId = req.params.inventoryId;
    const inventory = await findInventory({ inventoryId });

    if (!inventory) {
      next(new AppError("inventory does not exist", 404));
      return;
    }

    await deleteInventory({ inventoryId });
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

export async function getInventoryStatOfAProductHandler(req: Request<UpdateInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const product = req.params.inventoryId;
    const totalAddedStock = await getTotalAddedStock(product);
    const totalDistributedStock = await getTotalDistributedStock(product);

    console.log(totalAddedStock);
    console.log(totalDistributedStock);

    return res.status(200).json({
      status: "success",
      totalAddedStock,
      totalDistributedStock,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    return next(new AppError("Internal server error", 500));
  }
}
