import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateCategoryInput, UpdateCategoryInput } from "../schema/category.schema";
import { createCategory, deleteCategory, findAllCategory, findAndUpdateCategory, findCategory } from "../service/category.service";
var colors = require("colors");

export async function createCategoryHandler(req: Request<{}, {}, CreateCategoryInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findCategory({ name: body.name });

    if (alreadyExist) {
      next(new AppError(`category with the name (${body.name}) already exist`, 404));
      return;
    }

    const category = await createCategory(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: category,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllCategoryHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllCategory(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all category success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getCategoryHandler(req: Request<UpdateCategoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const categoryId = req.params.categoryId;
    const category = await findCategory({ categoryId });

    if (!category) {
      next(new AppError("category does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: category,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateCategoryHandler(req: Request<UpdateCategoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const categoryId = req.params.categoryId;
    const category: any = await findCategory({ categoryId });

    if (!category) {
      next(new AppError("Category does not exist", 404));
      return;
    }

    const updatedCategory = await findAndUpdateCategory({ categoryId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedCategory,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteCategoryHandler(req: Request<UpdateCategoryInput["params"]>, res: Response, next: NextFunction) {
  try {
    const categoryId = req.params.categoryId;
    const category = await findCategory({ categoryId });

    if (!category) {
      next(new AppError("category does not exist", 404));
      return;
    }

    await deleteCategory({ categoryId });
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
