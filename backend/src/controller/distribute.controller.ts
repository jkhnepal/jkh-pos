import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateDistributeInput, UpdateDistributeInput } from "../schema/distribute.schama";
import { createDistribute, findAllDistribute, findDistribute, findAndUpdateDistribute, deleteDistribute } from "../service/distribute.service";
import mongoose from "mongoose";
import DistributeModel from "../models/distribute.model";

var colors = require("colors");

export async function createDistributeHandler(req: Request<{}, {}, CreateDistributeInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;

    const distribute = await createDistribute(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: distribute,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllDistributeHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    const results = await findAllDistribute(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all distribute success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

// When admin distribute different product at different time to the branchm,
// It calculates the total quantity the branch received over the time.
export async function getAllUniqueProductInventoryOfABranchHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    const results = await findAllDistribute(queryParameters);

    // Extract unique product IDs
    const uniqueProductIds = results.map((result) => result.product._id).filter((value, index, self) => self.indexOf(value) === index);

    const uniqueProducts = await Promise.all(
      uniqueProductIds.map(async (productId) => {
        const totalQuantity = await getTotalStock(productId);
        const productResult: any = results.find((result: any) => result.product._id === productId);
        const { _id, branch, product, quantity, distributeId, createdAt, updatedAt, __v } = productResult?._doc;
        return { _id, branch, product, quantity, distributeId, createdAt, updatedAt, __v, totalQuantity };
      })
    );

    console.log(uniqueProducts);
    return res.json({
      status: "success",
      msg: "Get all distribute success",
      data: uniqueProducts,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getTotalStock(product: string) {
  const product_id = new mongoose.Types.ObjectId(product); // Convert product string to ObjectId

  const totalAddedStock = await DistributeModel.aggregate([
    {
      $match: { product: product_id },
    },
    {
      $group: {
        _id: "$product",
        totalStock: { $sum: "$quantity" },
      },
    },
  ]);
  return totalAddedStock[0]?.totalStock;
}

export async function getDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const distributeId = req.params.distributeId;
    const distribute = await findDistribute({ distributeId });

    if (!distribute) {
      next(new AppError("distribute does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: distribute,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const distributeId = req.params.distributeId;
    const distribute: any = await findDistribute({ distributeId });

    if (!distribute) {
      next(new AppError("Distribute does not exist", 404));
      return;
    }

    const updatedDistribute = await findAndUpdateDistribute({ distributeId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedDistribute,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const distributeId = req.params.distributeId;
    const distribute = await findDistribute({ distributeId });

    if (!distribute) {
      next(new AppError("distribute does not exist", 404));
      return;
    }

    await deleteDistribute({ distributeId });
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
