import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreatePaymentOutInput, UpdatePaymentOutInput } from "../schema/paymentOut.schema";
import { createPaymentOut, findAllPaymentOut, findPaymentOut, findAndUpdatePaymentOut, deletePaymentOut } from "../service/paymentOut.service";

var colors = require("colors");

export async function createPaymentOutHandler(req: Request<{}, {}, CreatePaymentOutInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const paymentOut = await createPaymentOut(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: paymentOut,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllPaymentOutHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query; // /categories?status=active

    const results = await findAllPaymentOut(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all paymentOut success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getPaymentOutHandler(req: Request<UpdatePaymentOutInput["params"]>, res: Response, next: NextFunction) {
  try {
    const paymentOutId = req.params.paymentOutId;
    const paymentOut = await findPaymentOut({ paymentOutId });

    if (!paymentOut) {
      next(new AppError("paymentOut does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: paymentOut,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updatePaymentOutHandler(req: Request<UpdatePaymentOutInput["params"]>, res: Response, next: NextFunction) {
  try {
    const paymentOutId = req.params.paymentOutId;
    const paymentOut: any = await findPaymentOut({ paymentOutId });

    if (!paymentOut) {
      next(new AppError("PaymentOut does not exist", 404));
      return;
    }

    const updatedPaymentOut = await findAndUpdatePaymentOut({ paymentOutId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedPaymentOut,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deletePaymentOutHandler(req: Request<UpdatePaymentOutInput["params"]>, res: Response, next: NextFunction) {
  try {
    const paymentOutId = req.params.paymentOutId;
    const paymentOut = await findPaymentOut({ paymentOutId });

    if (!paymentOut) {
      next(new AppError("paymentOut does not exist", 404));
      return;
    }

    await deletePaymentOut({ paymentOutId });
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
