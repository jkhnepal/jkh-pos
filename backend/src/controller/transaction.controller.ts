import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { findTransaction, createTransaction, findAllTransaction, findAndUpdateTransaction, deleteTransaction } from "../service/transaction.service";
import { CreateTransactionInput, UpdateTransactionInput } from "../schema/transaction.schema";
import TransactionModel from "../models/transaction.model";
var colors = require("colors");

export async function createTransactionHandler(req: Request<{}, {}, CreateTransactionInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;

    const transaction = await createTransaction(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: transaction,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllTransactionHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;
    console.log("queryParameters", queryParameters);

    const results = await findAllTransaction(queryParameters);
    console.log(results);
    return res.json({
      status: "success",
      msg: "Get all transaction success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getTransactionHandler(req: Request<UpdateTransactionInput["params"]>, res: Response, next: NextFunction) {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await findTransaction({ transactionId });

    if (!transaction) {
      next(new AppError("transaction does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: transaction,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateTransactionHandler(req: Request<UpdateTransactionInput["params"]>, res: Response, next: NextFunction) {
  try {
    const transactionId = req.params.transactionId;
    const transaction: any = await findTransaction({ transactionId });

    if (!transaction) {
      next(new AppError("Transaction does not exist", 404));
      return;
    }

    const updatedTransaction = await findAndUpdateTransaction({ transactionId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedTransaction,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteTransactionHandler(req: Request<UpdateTransactionInput["params"]>, res: Response, next: NextFunction) {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await findTransaction({ transactionId });

    if (!transaction) {
      next(new AppError("transaction does not exist", 404));
      return;
    }

    await deleteTransaction({ transactionId });
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

export async function getTransactionsByBranchAndDateHandler(req: any, res: Response, next: NextFunction) {
  try {
    const { branchId, date } = req.params;

    const [year, month] = date.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1); // Month in JavaScript is 0-indexed, so we subtract 1
    const endDate = new Date(year, month, 0);

    const sales = await TransactionModel.find({
      branch: branchId,
      createdAt: { $gte: startDate, $lte: endDate },
    })
    .sort({ createdAt: -1 });

    // const adjustedSales = sales.map((sale: any) => {
    //   const quantityAfterReturn = sale.quantity - sale.returnedQuantity;
    //   return {
    //     _id: sale._id,
    //     branch: sale.branch,
    //     product: sale.product,
    //     quantity: sale.quantity,
    //     quantityAfterReturn: sale.quantity - sale.returnedQuantity,
    //     cp: sale.cp,
    //     sp: sale.sp,
    //     totalAmount: sale.totalAmount,
    //     returnedQuantity: sale.returnedQuantity,
    //     discountAmount: sale.discountAmount,
    //     invoiceNo: sale.invoiceNo,
    //     totalAmountAfterReturn: sale.totalAmount - sale.sp * sale.returnedQuantity,
    //     memberName: sale.memberName,
    //     memberPhone: sale.memberPhone,
    //     saleId: sale.saleId,
    //     createdAt: sale.createdAt,
    //     updatedAt: sale.updatedAt,
    //     __v: sale.__v,
    //   };
    // });

    console.log(sales);

    return res.json({
      status: "success",
      msg: "Sales fetched successfully",
      data: sales,
    });
  } catch (error: any) {
    console.error("msg:", error.message);
    next(new AppError("Internal server error", 500));
  }
}
