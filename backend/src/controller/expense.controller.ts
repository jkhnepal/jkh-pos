import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { uploadSingleFile } from "../middleware/uploadSingleFile";
import { CreateExpenseInput, UpdateExpenseInput } from "../schema/expense.schema";
import { createExpense, findAllExpense, findExpense, findAndUpdateExpense, deleteExpense } from "../service/expense.service";
var colors = require("colors");

export async function createExpenseHandler(req: Request<{}, {}, CreateExpenseInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const expense = await createExpense(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: expense,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllExpenseHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; 
    const results = await findAllExpense(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all expense success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getExpenseHandler(req: Request<UpdateExpenseInput["params"]>, res: Response, next: NextFunction) {
  try {
    const expenseId = req.params.expenseId;
    const expense = await findExpense({ expenseId });

    if (!expense) {
      next(new AppError("expense does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: expense,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateExpenseHandler(req: Request<UpdateExpenseInput["params"]>, res: Response, next: NextFunction) {
  try {
    const expenseId = req.params.expenseId;
    const expense: any = await findExpense({ expenseId });

    if (!expense) {
      next(new AppError("Expense does not exist", 404));
      return;
    }

    const updatedExpense = await findAndUpdateExpense({ expenseId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedExpense,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteExpenseHandler(req: Request<UpdateExpenseInput["params"]>, res: Response, next: NextFunction) {
  try {
    const expenseId = req.params.expenseId;
    const expense = await findExpense({ expenseId });

    if (!expense) {
      next(new AppError("expense does not exist", 404));
      return;
    }

    await deleteExpense({ expenseId });
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
