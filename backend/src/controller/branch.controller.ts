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
import BranchModel from "../models/branch.model";
var colors = require("colors");
import nodemailer from "nodemailer";
import BranchInventoryModel from "../models/branchInventory.model";
import DistributeModel from "../models/distribute.model";
import ReturnModel from "../models/return.model";
import ReturnToHeadquarterModel from "../models/returnToHeadquarter.model";
import SaleModel from "../models/sale.model";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "admin@jackethousenepal.com",
    pass: "JKH-Admin002",
  },
});

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

    // const alreadyExistWithPhone = await findBranch({ phone: body.phone });
    // if (alreadyExistWithPhone) {
    //   next(new AppError(`Branch with the phone (${body.phone}) already exist`, 404));
    //   return;
    // }

    const hashedPassword = await generateHashedPassword(req.body.password);
    const branch = await createBranch({ ...req.body, password: hashedPassword });

    const admin: any = await BranchModel.findOne({ type: "headquarter" });

    const info = await transporter.sendMail({
      from: "loki@webxnep.com",
      to: admin.email,
      subject: "New password created",
      html: `<div>
    <div class="container">
      <div class="content">
        <p class="heading">Password of the branch (${body.name}) is: <span style="font-weight: bold; color: blue;">${body.password}</span></p>  
      </div>
    <div class="footer">
      <p>Thank You</p>
      </div>
      </div>
   </div>`,
    });

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

export async function getBranchFromTokenHandler(req: any, res: Response, next: NextFunction) {
  try {
    const decodedBranch: any = req.user;
    return res.json({
      status: "success",
      msg: "Get user from token success",
      data: decodedBranch,
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
    console.log(branch);

    if (!branch) {
      next(new AppError("Branch does not exist", 404));
      return;
    }

    // delete all the data related to this branch
    await BranchInventoryModel.deleteMany({ branch: branch?._id });
    await DistributeModel.deleteMany({ branch: branch?._id });
    await ReturnModel.deleteMany({ branch: branch?._id });
    await ReturnToHeadquarterModel.deleteMany({ branch: branch?._id });
    await SaleModel.deleteMany({ branch: branch?._id });

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
    const re = await sendResetPassword(branch.email, newPassword);

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
    next(new AppError("Internal server error", 500));
  }
}

export async function resetBranchPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const branch: any = await findBranch({ email: req.params.email });

    if (!branch) {
      return res.status(404).json({
        status: "failure",
        msg: "Branch does not exist.",
      });
    }

    const admin: any = await BranchModel.findOne({ type: "headquarter" });
    const newPassword = generateRandomPassword(10);

    const info = await transporter.sendMail({
      from: "loki@webxnep.com",
      to: "lokendrachaulagain803@gmail.com",
      subject: "Password Has Been Changed",
      html: `<div>
    <div class="container">
     <div class="content">
     <p class="heading">Branch (${branch.name}) password has been changed . New Password: <span style="font-weight: bold; color: blue;">${newPassword}</span></p>  
     </div>
     <div class="footer">
      <p>Thank You.</p>
 </div>
 </div>
   </div>`,
    });

    // Update password
    const hashedPassword = await generateHashedPassword(newPassword);
    const updatedBranch = await BranchModel.findOneAndUpdate({ branchId: branch?.branchId }, { password: hashedPassword }, { new: true });

    return res.status(200).json({
      status: "success",
      msg: "Password reset successful , check your email",
    });
  } catch (error) {
    next(new AppError("Internal server error", 500));
  }
}
