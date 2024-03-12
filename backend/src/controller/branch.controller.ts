import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { findBranch, createBranch, findAllBranch, findAndUpdateBranch, deleteBranch } from "../service/branch.service";
import { CreateBranchInput, UpdateBranchInput } from "../schema/branch.schems";
var colors = require("colors");

export async function createBranchHandler(req: Request<{}, {}, CreateBranchInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findBranch({ name: body.name });

    if (alreadyExist) {
      next(new AppError(`branch with the name (${body.name}) already exist`, 404));
      return;
    }

    const branch = await createBranch(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: branch,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllBranchHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllBranch(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all branch success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getBranchHandler(req: Request<UpdateBranchInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;
    const branch = await findBranch({ branchId });

    if (!branch) {
      next(new AppError("branch does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: branch,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateBranchHandler(req: Request<UpdateBranchInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;
    const branch: any = await findBranch({ branchId });

    if (!branch) {
      next(new AppError("Branch does not exist", 404));
      return;
    }

    const updatedBranch = await findAndUpdateBranch({ branchId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedBranch,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteBranchHandler(req: Request<UpdateBranchInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;
    const branch = await findBranch({ branchId });

    if (!branch) {
      next(new AppError("branch does not exist", 404));
      return;
    }

    await deleteBranch({ branchId });
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
