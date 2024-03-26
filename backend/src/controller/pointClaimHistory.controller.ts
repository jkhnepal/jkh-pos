import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreatePointClaimHistoryInput, UpdatePointClaimHistoryInput } from "../schema/pointClaim.schema";
import { findPointClaimHistory, createPointClaimHistory, findAllPointClaimHistory, findAndUpdatePointClaimHistory, deletePointClaimHistory } from "../service/pointClaimHistory.service";
var colors = require("colors");

export async function createPointClaimHistoryHandler(req: Request<{}, {}, CreatePointClaimHistoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const pointClaimHistory = await createPointClaimHistory(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: pointClaimHistory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllPointClaimHistoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    const results = await findAllPointClaimHistory(queryParameters);
    return res.status(200).json({
      status: "success",
      msg: "Get all pointClaimHistory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getPointClaimHistoryHandler(req: Request<UpdatePointClaimHistoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const pointClaimHistoryId = req.params.pointClaimHistoryId;
    const pointClaimHistory = await findPointClaimHistory({ pointClaimHistoryId });

    if (!pointClaimHistory) {
      next(new AppError("Branch Inventory does not exist", 404));
    }

    return res.status(200).json({
      status: "success",
      msg: "Get success",
      data: pointClaimHistory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updatePointClaimHistoryHandler(req: Request<UpdatePointClaimHistoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const pointClaimHistoryId = req.params.pointClaimHistoryId;
    const pointClaimHistory: any = await findPointClaimHistory({ pointClaimHistoryId });

    if (!pointClaimHistory) {
      next(new AppError("Branch Inventory does not exist", 404));
      return;
    }

    const updatedPointClaimHistory = await findAndUpdatePointClaimHistory({ pointClaimHistoryId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedPointClaimHistory,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deletePointClaimHistoryHandler(req: Request<UpdatePointClaimHistoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const pointClaimHistoryId = req.params.pointClaimHistoryId;
    const pointClaimHistory = await findPointClaimHistory({ pointClaimHistoryId });

    if (!pointClaimHistory) {
      next(new AppError("Branch Inventory does not exist", 404));
      return;
    }

    await deletePointClaimHistory({ pointClaimHistoryId });
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
