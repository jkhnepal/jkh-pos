import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateUnitInput, UpdateUnitInput } from "../schema/unit.schems";
import { findUnit, createUnit, findAllUnit, findAndUpdateUnit, deleteUnit } from "../service/unit.service";
var colors = require("colors");

export async function createUnitHandler(req: Request<CreateUnitInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findUnit({ name: body.name });

    if (alreadyExist) {
      next(new AppError(`Unit with the name (${body.name}) already exist`, 409));
      return;
    }

    const unit = await createUnit(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: unit,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllUnitHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllUnit(queryParameters);
    return res.status(200).json({
      status: "success",
      msg: "Get all unit success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getUnitHandler(req: Request<UpdateUnitInput["params"]>, res: Response, next: NextFunction) {
  try {
    const unitId = req.params.unitId;
    const unit = await findUnit({ unitId });

    if (!unit) {
      next(new AppError("Unit does not exist", 404));
      return;
    }

    return res.status(200).json({
      status: "success",
      msg: "Get success",
      data: unit,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateUnitHandler(req: Request<UpdateUnitInput["params"]>, res: Response, next: NextFunction) {
  try {
    const unitId = req.params.unitId;
    const unit = await findUnit({ unitId });

    if (!unit) {
      next(new AppError("Unit does not exist", 404));
      return;
    }

    const updatedUnit = await findAndUpdateUnit({ unitId }, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedUnit,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteUnitHandler(req: Request<UpdateUnitInput["params"]>, res: Response, next: NextFunction) {
  try {
    const unitId = req.params.unitId;
    const unit = await findUnit({ unitId });

    if (!unit) {
      next(new AppError("unit does not exist", 404));
      return;
    }

    await deleteUnit({ unitId });
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
