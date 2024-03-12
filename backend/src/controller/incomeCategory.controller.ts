import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateIncomeCategoryInput, UpdateIncomeCategoryInput } from "../schema/incomeCategory.schema";
import { findIncomeCategory, createIncomeCategory, findAllIncomeCategory, findAndUpdateIncomeCategory, deleteIncomeCategory } from "../service/incomeCategory.service";
var colors = require("colors");

export async function createIncomeCategoryHandler(req: Request<{}, {}, CreateIncomeCategoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findIncomeCategory({ name: body.name });

    if (alreadyExist) {
      next(new AppError(`IncomeCategory with the name (${body.name}) already exist`, 404));
      return;
    }

    const item = await createIncomeCategory(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: item,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllIncomeCategoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllIncomeCategory(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getIncomeCategoryHandler(req: Request<UpdateIncomeCategoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const incomeCategoryId = req.params.incomeCategoryId;
    const item = await findIncomeCategory({ incomeCategoryId });

    if (!item) {
      next(new AppError("IncomeCategory does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: item,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateIncomeCategoryHandler(req: Request<UpdateIncomeCategoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const incomeCategoryId = req.params.incomeCategoryId;
    const item = await findIncomeCategory({ incomeCategoryId });

    if (!item) {
      next(new AppError("IncomeCategory does not exist", 404));
      return;
    }

    const updated = await findAndUpdateIncomeCategory({ incomeCategoryId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteIncomeCategoryHandler(req: Request<UpdateIncomeCategoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const incomeCategoryId = req.params.incomeCategoryId;
    const item = await findIncomeCategory({ incomeCategoryId });

    if (!item) {
      next(new AppError("IncomeCategory does not exist", 404));
      return;
    }

    await deleteIncomeCategory({ incomeCategoryId });
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
