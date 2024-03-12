import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { uploadSingleFile } from "../middleware/uploadSingleFile";
import { CreateIncomeInput, UpdateIncomeInput } from "../schema/income.schema";
import { findIncome, createIncome, findAllIncome, findAndUpdateIncome, deleteIncome } from "../service/income.service";
var colors = require("colors");

export async function createIncomeHandler(req: Request<{}, {}, CreateIncomeInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const income = await createIncome(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: income,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllIncomeHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllIncome(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all income success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getIncomeHandler(req: Request<UpdateIncomeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const incomeId = req.params.incomeId;
    const income = await findIncome({ incomeId });

    if (!income) {
      next(new AppError("income does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: income,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateIncomeHandler(req: Request<UpdateIncomeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const incomeId = req.params.incomeId;
    const income: any = await findIncome({ incomeId });

    if (!income) {
      next(new AppError("Income does not exist", 404));
      return;
    }

    const updatedIncome = await findAndUpdateIncome({ incomeId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedIncome,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteIncomeHandler(req: Request<UpdateIncomeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const incomeId = req.params.incomeId;
    const income = await findIncome({ incomeId });

    if (!income) {
      next(new AppError("income does not exist", 404));
      return;
    }

    await deleteIncome({ incomeId });
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
