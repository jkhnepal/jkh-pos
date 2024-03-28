import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateInventoryInput, UpdateInventoryInput } from "../schema/inventory.schema";
import { findInventory, createInventory, findAllInventory, findAndUpdateInventory, deleteInventory } from "../service/inventory.service";
import { findAndUpdateProduct } from "../service/product.service";
var colors = require("colors");

export async function createInventoryHandler(req: Request<{}, {}, CreateInventoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;

    const inventory = await createInventory(body);
    const updatedProduct = await findAndUpdateProduct({ _id: body.product }, { $inc: { availableStock: +body.stock, totalAddedStock: +body.stock } }, { new: true });

    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllInventoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

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
    const inventory: any = await findInventory({ inventoryId });

    if (!inventory) {
      next(new AppError("Inventory does not exist", 404));
      return;
    }

    const requestedStock = req.body.stock;

    if (inventory.stock > requestedStock) {
      // If existing stock is greater than requested stock, subtract the difference
      const stockDifference = inventory.stock - requestedStock;
      await findAndUpdateInventory({ inventoryId }, { stock: requestedStock }, { new: true });
      await findAndUpdateProduct(
        { _id: inventory.product },
        {
          $inc: {
            availableStock: -stockDifference,
            totalAddedStock: -stockDifference,
          },
        },
        { new: true }
      );
    } else if (inventory.stock < requestedStock) {
      // If existing stock is less than requested stock, add the difference
      const stockDifference = requestedStock - inventory.stock;
      await findAndUpdateInventory({ inventoryId }, { stock: requestedStock }, { new: true });

      await findAndUpdateProduct(
        { _id: inventory.product },
        {
          $inc: {
            availableStock: stockDifference,
            totalAddedStock: stockDifference,
          },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      status: "success",
      msg: "Update success",
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
