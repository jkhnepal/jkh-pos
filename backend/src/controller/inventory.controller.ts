import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateInventoryInput, UpdateInventoryInput } from "../schema/inventory.schema";
import { findInventory, createInventory, findAllInventory, findAndUpdateInventory, deleteInventory } from "../service/inventory.service";
import { findAndUpdateHeadquarterInventory, findHeadquarterInventory } from "../service/headquarterInventory.service";
import { findAndUpdateProduct, findProduct } from "../service/product.service";
var colors = require("colors");

// export async function createInventoryHandler(req: Request<{}, {}, CreateInventoryInput["body"]>, res: Response, next: NextFunction) {
//   try {
//     const body = req.body;

//     const inventory = await createInventory(body);
//     const headquarterInventory = await findHeadquarterInventory({ product: req.body.product });

//     let updatedHeadquarterInventory;
//     if (headquarterInventory) {
//       const newTotalstock = (headquarterInventory.totalStock += body.stock);
//       updatedHeadquarterInventory = await findAndUpdateHeadquarterInventory({ headquarterInventoryId: headquarterInventory?.headquarterInventoryId }, { totalStock: newTotalstock }, { new: true });
//     }

//     return res.status(201).json({
//       status: "success",
//       msg: "Create success",
//       data: { inventory, updatedHeadquarterInventory },
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

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

// export async function updateInventoryHandler(req: Request<UpdateInventoryInput["params"]>, res: Response, next: NextFunction) {
//   try {
//     const inventoryId = req.params.inventoryId;
//     const inventory: any = await findInventory({ inventoryId });
//     console.log("🚀 ~ updateInventoryHandler ~ inventory:", inventory);

//     if (!inventory) {
//       next(new AppError("Inventory does not exist", 404));
//       return;
//     }

//     const updatedInventory = await findAndUpdateInventory({ inventoryId: inventory.inventoryId }, { stock: req.body.stock }, { new: true });
//     console.log("🚀 ~ updateInventoryHandler ~ updatedInventory:", updatedInventory);

//     if inventory.stock is greater than req.body.stock then subtract , if opposite then add

//     const updatedProduct = await findAndUpdateProduct({ _id: req.body.product }, { availableStock: req.body.stock }, { new: true });

//     return res.status(200).json({
//       status: "success",
//       msg: "Update success",
//       // data: updatedInventory,
//     });
//   } catch (error: any) {
//     console.error("Error:", error.message);
//     next(new AppError("Internal server error", 500));
//   }
// }

export async function updateInventoryHandler(req: Request<UpdateInventoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const inventoryId = req.params.inventoryId;
    const inventory: any = await findInventory({ inventoryId });
    console.log("🚀 ~ updateInventoryHandler ~ inventory:", inventory);

    if (!inventory) {
      next(new AppError("Inventory does not exist", 404));
      return;
    }

    const requestedStock = req.body.stock;

    // Compare existing stock with requested stock
    if (inventory.stock > requestedStock) {
      // If existing stock is greater than requested stock, subtract the difference
      const stockDifference = inventory.stock - requestedStock;
      const updatedInventory = await findAndUpdateInventory({ inventoryId }, { stock: requestedStock }, { new: true });
      console.log("🚀 ~ updateInventoryHandler ~ updatedInventory:", updatedInventory);

      // Subtract stock from product
      const updatedProduct = await findAndUpdateProduct({ _id: inventory.product }, { $inc: { availableStock: -stockDifference } }, { new: true });
    } else if (inventory.stock < requestedStock) {
      // If existing stock is less than requested stock, add the difference
      const stockDifference = requestedStock - inventory.stock;
      const updatedInventory = await findAndUpdateInventory({ inventoryId }, { stock: requestedStock }, { new: true });
      console.log("🚀 ~ updateInventoryHandler ~ updatedInventory:", updatedInventory);

      // Add stock to product
      const updatedProduct = await findAndUpdateProduct({ _id: inventory.product }, { $inc: { availableStock: stockDifference } }, { new: true });
    } else {
      // Stock remains unchanged, no need to update product stock
      const updatedInventory = await findAndUpdateInventory({ inventoryId }, { stock: requestedStock }, { new: true });
      console.log("🚀 ~ updateInventoryHandler ~ updatedInventory:", updatedInventory);
    }

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      // data: updatedInventory,
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
