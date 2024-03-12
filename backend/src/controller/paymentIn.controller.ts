import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreatePaymentInInput, UpdatePaymentInInput } from "../schema/paymentIn.schema";
import { createPaymentIn, findAllPaymentIn, findPaymentIn, findAndUpdatePaymentIn, deletePaymentIn } from "../service/paymentIn.service";
var colors = require("colors");

export async function createPaymentInHandler(req: Request<{}, {}, CreatePaymentInInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const paymentIn = await createPaymentIn(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: paymentIn,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllPaymentInHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllPaymentIn(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all paymentIn success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getPaymentInHandler(req: Request<UpdatePaymentInInput["params"]>, res: Response, next: NextFunction) {
  try {
    const paymentInId = req.params.paymentInId;
    const paymentIn = await findPaymentIn({ paymentInId });

    if (!paymentIn) {
      next(new AppError("paymentIn does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: paymentIn,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updatePaymentInHandler(req: Request<UpdatePaymentInInput["params"]>, res: Response, next: NextFunction) {
  try {
    const paymentInId = req.params.paymentInId;
    const paymentIn: any = await findPaymentIn({ paymentInId });

    if (!paymentIn) {
      next(new AppError("PaymentIn does not exist", 404));
      return;
    }

    const updatedPaymentIn = await findAndUpdatePaymentIn({ paymentInId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedPaymentIn,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deletePaymentInHandler(req: Request<UpdatePaymentInInput["params"]>, res: Response, next: NextFunction) {
  try {
    const paymentInId = req.params.paymentInId;
    const paymentIn = await findPaymentIn({ paymentInId });

    if (!paymentIn) {
      next(new AppError("paymentIn does not exist", 404));
      return;
    }

    await deletePaymentIn({ paymentInId });
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
