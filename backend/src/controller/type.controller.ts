import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateTypeInput, UpdateTypeInput } from "../schema/type.schema";
import { findType, createType, findAllType, findAndUpdateType, deleteType } from "../service/type.service";
var colors = require("colors");

export async function createTypeHandler(req: Request<{}, {}, CreateTypeInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findType({ name: body.name });

    if (alreadyExist) {
      next(new AppError(`Type with the name (${body.name}) already exist`, 404));
      return;
    }

    const type = await createType(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: type,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllTypeHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllType(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all type success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getTypeHandler(req: Request<UpdateTypeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const typeId = req.params.typeId;
    const type = await findType({ typeId });

    if (!type) {
      next(new AppError("Type does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: type,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateTypeHandler(req: Request<UpdateTypeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const typeId = req.params.typeId;
    const type: any = await findType({ typeId });

    if (!type) {
      next(new AppError("Type does not exist", 404));
      return;
    }

    const updated = await findAndUpdateType({ typeId }, req.body, {
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

export async function deleteTypeHandler(req: Request<UpdateTypeInput["params"]>, res: Response, next: NextFunction) {
  try {
    const typeId = req.params.typeId;
    const type = await findType({ typeId });

    if (!type) {
      next(new AppError("Type does not exist", 404));
      return;
    }

    await deleteType({ typeId });
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
