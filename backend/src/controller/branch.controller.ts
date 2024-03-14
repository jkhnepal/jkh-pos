import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { findBranch, createBranch, findAllBranch, findAndUpdateBranch, deleteBranch } from "../service/branch.service";
import { CreateBranchInput, UpdateBranchInput } from "../schema/branch.schems";
import { generateHashedPassword } from "../utils/generateHashedPassword";
import { LoginInput } from "../schema/login.schema";
import { validatePassword } from "../utils/validatePassword";
import jwt from "jsonwebtoken";
import generateRandomPassword from "../utils/generateRandomPassword";
import { sendResetPassword } from "../utils/mailService";
var colors = require("colors");

export async function createBranchHandler(req: Request<{}, {}, CreateBranchInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;

    const alreadyExistWithName = await findBranch({ name: body.name });
    if (alreadyExistWithName) {
      next(new AppError(`Branch with the name (${body.name}) already exist`, 404));
      return;
    }

    const alreadyExistWithEmail = await findBranch({ email: body.email });
    if (alreadyExistWithEmail) {
      next(new AppError(`Branch with the email (${body.email}) already exist`, 404));
      return;
    }

    const alreadyExistWithPhone = await findBranch({ phone: body.phone });
    if (alreadyExistWithPhone) {
      next(new AppError(`Branch with the phone (${body.phone}) already exist`, 404));
      return;
    }

    const hashedPassword = await generateHashedPassword(req.body.password);
    const branch = await createBranch({ ...req.body, password: hashedPassword });

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
    const queryParameters = req.query;

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

export async function loginBranchHandler(req: Request<{}, {}, LoginInput["body"]>, res: Response, next: NextFunction) {
  const branch = await validatePassword(req.body);

  if (!branch) {
    return res.status(401).json({
      success: false,
      msg: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign({ branch }, `${process.env.AUTH_SECRET_KEY}`, { expiresIn: "30d" });
  res.status(200).json({
    msg: "Login success",
    success: true,
    accessToken: accessToken,
    branch: branch,
  });
}

export async function getBranchHandler(req: Request<UpdateBranchInput["params"]>, res: Response, next: NextFunction) {
  try {
    const branchId = req.params.branchId;
    const branch = await findBranch({ branchId });

    if (!branch) {
      next(new AppError("Branch does not exist", 404));
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

    // password cant nbe change from this endpint
    if ("password" in req.body) {
      return res.status(403).json({
        status: "failure",
        msg: "Password update is not allowed through this endpoint",
      });
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
      next(new AppError("Branch does not exist", 404));
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

export async function resetPasswordHandler(req: Request<UpdateBranchInput["params"]>, res: Response, next: NextFunction) {
  try {
    const email = req.params.branchId;
    const branch: any = await findBranch({ email });

   

    if (!branch) {
      return res.status(404).json({
        status: "failure",
        msg: "Branch does not exist.",
      });
    }

    const newPassword = generateRandomPassword(10);
    console.log(newPassword)
    const re=await sendResetPassword(branch.email, newPassword);
    console.log(re)

    const hashedPassword = await generateHashedPassword(newPassword);

    await findAndUpdateBranch(
      { branchId: branch.branchId },
      { pssword: hashedPassword },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      msg: "Password reset successful , check your email",
    });
  } catch (error) {
    console.error("Error:", error);
    next(new AppError("Internal server error", 500));
  }
}
