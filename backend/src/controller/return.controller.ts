import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import BranchInventoryModel from "../models/branchInventory.model";
import { CreateReturnInput, UpdateReturnInput } from "../schema/return.schema";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import { createReturn, findAllReturn, findReturn, findAndUpdateReturn, deleteReturn } from "../service/return.service";
import { findAndUpdateSale } from "../service/sale.service";
import { findAndUpdateMember, findMember } from "../service/member.service";
var colors = require("colors");

// export async function createReturnHandler(req: Request<{}, {}, CreateReturnInput["body"]>, res: Response, next: NextFunction) {
//   try {
//     const body = req.body;
//     const returnHistory = await createReturn(body);
//     const updatedSale: any = await findAndUpdateSale(
//       { _id: body.sale },
//       { isReturned: true },
//       {
//         new: true,
//       }
//     );

//     const discountDecimal = updatedSale.discount / 100;
//     const discountedAmount = updatedSale.sp * (1 - discountDecimal);

//     const amountToBeSubtract = discountedAmount * body.quantity;

//     // add that item in branch inventory
//     const branchInventory: any = await BranchInventoryModel.findOne({ branch: body.branch, product: updatedSale.product });
//     const updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { $inc: { totalStock: +body.quantity } }, { new: true });

//     const pointsToSubtract = amountToBeSubtract * 0.1;
//     const member: any = await findMember({ _id: body.member });

//     const updatedMember = await findAndUpdateMember({ _id: member._id }, { $inc: { point: -pointsToSubtract } }, { new: true });

//     return res.status(200).json({
//       status: "success",
//       msg: "Return success",
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

export async function createReturnHandler(req: Request<{}, {}, CreateReturnInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const returnHistory = await createReturn(body);
    const updatedSale: any = await findAndUpdateSale(
      { _id: body.sale },
      { isReturned: true },
      {
        new: true,
      }
    );

    // add that item in branch inventory
    const branchInventory: any = await BranchInventoryModel.findOne({ branch: body.branch, product: updatedSale.product });
    const updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { $inc: { totalStock: +body.quantity } }, { new: true });

    const pointsToSubtract = updatedSale.sp * 0.1;

    const member: any = await findMember({ _id: body.member });
    const updatedMember = await findAndUpdateMember({ _id: member._id }, { $inc: { point: -pointsToSubtract } }, { new: true });

    return res.status(200).json({
      status: "success",
      msg: "Return success",
      data: { returnHistory, updatedSale, updatedBranchInventory, updatedMember },
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllReturnHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    const results = await findAllReturn(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all returnHistory success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getReturnHandler(req: Request<UpdateReturnInput["params"]>, res: Response, next: NextFunction) {
  try {
    const returnId = req.params.returnId;
    const returnHistory = await findReturn({ returnId });

    if (!returnHistory) {
      next(new AppError("returnHistory does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: returnHistory,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateReturnHandler(req: Request<UpdateReturnInput["params"]>, res: Response, next: NextFunction) {
  try {
    const returnId = req.params.returnId;
    const returnHistory: any = await findReturn({ returnId });

    if (!returnHistory) {
      next(new AppError("Return does not exist", 404));
      return;
    }

    const updatedReturn = await findAndUpdateReturn({ returnId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedReturn,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteReturnHandler(req: Request<UpdateReturnInput["params"]>, res: Response, next: NextFunction) {
  try {
    const returnId = req.params.returnId;
    const returnHistory = await findReturn({ returnId });

    if (!returnHistory) {
      next(new AppError("returnHistory does not exist", 404));
      return;
    }

    await deleteReturn({ returnId });
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
