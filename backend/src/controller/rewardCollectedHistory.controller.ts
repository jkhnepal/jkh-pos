import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateRewardCollectedHistoryInput, UpdateRewardCollectedHistoryInput } from "../schema/rewardCollectedHistory.schema";
import { findRewardCollectedHistory, createRewardCollectedHistory, findAllRewardCollectedHistory, findAndUpdateRewardCollectedHistory, deleteRewardCollectedHistory } from "../service/rewardCollectedHistory.service";
var colors = require("colors");

export async function createRewardCollectedHistoryHandler(req: Request<{}, {}, CreateRewardCollectedHistoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const rewardCollectedHistory = await createRewardCollectedHistory(body);

    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: rewardCollectedHistory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllRewardCollectedHistoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    const results = await findAllRewardCollectedHistory(queryParameters);
    return res.status(200).json({
      status: "success",
      msg: "Get all rewardCollectedHistory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getRewardCollectedHistoryHandler(req: Request<UpdateRewardCollectedHistoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const rewardCollectedHistoryId = req.params.rewardCollectedHistoryId;
    const rewardCollectedHistory = await findRewardCollectedHistory({ rewardCollectedHistoryId });

    if (!rewardCollectedHistory) {
      next(new AppError("Branch Inventory does not exist", 404));
    }

    return res.status(200).json({
      status: "success",
      msg: "Get success",
      data: rewardCollectedHistory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateRewardCollectedHistoryHandler(req: Request<UpdateRewardCollectedHistoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const rewardCollectedHistoryId = req.params.rewardCollectedHistoryId;
    const rewardCollectedHistory: any = await findRewardCollectedHistory({ rewardCollectedHistoryId });

    if (!rewardCollectedHistory) {
      next(new AppError("Branch Inventory does not exist", 404));
      return;
    }

    const updatedRewardCollectedHistory = await findAndUpdateRewardCollectedHistory({ rewardCollectedHistoryId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedRewardCollectedHistory,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteRewardCollectedHistoryHandler(req: Request<UpdateRewardCollectedHistoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const rewardCollectedHistoryId = req.params.rewardCollectedHistoryId;
    const rewardCollectedHistory = await findRewardCollectedHistory({ rewardCollectedHistoryId });

    if (!rewardCollectedHistory) {
      next(new AppError("Branch Inventory does not exist", 404));
      return;
    }

    await deleteRewardCollectedHistory({ rewardCollectedHistoryId });
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
