import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { findAndUpdateBranchInventory } from "../service/branchInventory.service";
import BranchInventoryModel from "../models/branchInventory.model";
import { findAndUpdateProduct } from "../service/product.service";
import { CreateReturnToHeadquarterInput } from "../schema/returnToHeadquarter.schema";
import { createReturnToHeadquarter } from "../service/returnToHeadquarter.service";

var colors = require("colors");

export async function createReturnToHeadquarterHandler(req: Request<{}, {}, CreateReturnToHeadquarterInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const returnToHeadquarter = await createReturnToHeadquarter(body);

    //incerement the available stock of the product of headquarter
    const updatedProduct = await findAndUpdateProduct({ _id: body.product }, { $inc: { availableStock: +body.returnedQuantity } }, { new: true });
   
    //decrement the total stock of the product of the branch
    const branchInventory: any = await BranchInventoryModel.findOne({ branch: body.branch, product: body.product });

    let updatedBranchInventory;
    if (branchInventory) {
      updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { $inc: { totalStock: -body.returnedQuantity } }, { new: true });
    }

    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: returnToHeadquarter,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

// export async function getAllDistributeHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const queryParameters = req.query;

//     const results = await findAllDistribute(queryParameters);
//     return res.json({
//       status: "success",
//       msg: "Get all distribute success",
//       data: results,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function getAllDistributeOfABranchHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const queryParameters = req.query;

//     const results = await findAllDistributeOfABranch(queryParameters);
//     return res.json({
//       status: "success",
//       msg: "Get all distribute success",
//       data: results,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function getAllUniqueProductInventoryOfABranchHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const queryParameters = req.query;
//     const results: any = await findAllDistribute(queryParameters);

//     console.log(results);

//     // Extract unique product IDs
//     const uniqueProductIds = results.map((result: any) => result.product._id).filter((value: any, index: any, self: any) => self.indexOf(value) === index);

//     const uniqueProducts = await Promise.all(
//       uniqueProductIds.map(async (productId: any) => {
//         const totalQuantity = await getTotalStock(productId);
//         const productResult: any = results.find((result: any) => result.product._id === productId);
//         const { _id, branch, product, quantity, distributeId, createdAt, updatedAt, __v } = productResult?._doc;
//         return { _id, branch, product, quantity, distributeId, createdAt, updatedAt, __v, totalQuantity };
//       })
//     );

//     console.log(uniqueProducts);
//     return res.json({
//       status: "success",
//       msg: "Get all distribute success",
//       data: uniqueProducts,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function getTotalStock(product: string) {
//   const product_id = new mongoose.Types.ObjectId(product); // Convert product string to ObjectId

//   const totalAddedStock = await DistributeModel.aggregate([
//     {
//       $match: { product: product_id },
//     },
//     {
//       $group: {
//         _id: "$product",
//         totalStock: { $sum: "$quantity" },
//       },
//     },
//   ]);
//   return totalAddedStock[0]?.totalStock;
// }

// export async function getDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
//   try {
//     const distributeId = req.params.distributeId;
//     const distribute = await findDistribute({ distributeId });

//     if (!distribute) {
//       next(new AppError("distribute does not exist", 404));
//     }

//     return res.json({
//       status: "success",
//       msg: "Get success",
//       data: distribute,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function updateDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
//   try {
//     const distributeId = req.params.distributeId;
//     const distribute: any = await findDistribute({ distributeId });
//     const branchInventory: any = await BranchInventoryModel.findOne({ branch: distribute.branch, product: distribute.product });

//     if (!distribute) {
//       return res.status(404).json({
//         status: "success",
//         msg: "Distribute does not exist",
//       });
//     }

//     const updatedDistribute = await findAndUpdateDistribute({ distributeId }, req.body, {
//       new: true,
//     });

//     let updatedBranchInventory;
//     if (branchInventory) {
//       const newTotalstock = (branchInventory.totalStock += req.body.quantity -= distribute.quantity);
//       updatedBranchInventory = await findAndUpdateBranchInventory({ branchInventoryId: branchInventory?.branchInventoryId }, { totalStock: newTotalstock }, { new: true });
//     }

//     // console.log(updatedBranchInventory);

//     return res.status(200).json({
//       status: "success",
//       msg: "Update success",
//       data: updatedDistribute,
//     });
//   } catch (error: any) {
//     console.error("Error:", error.message);
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function acceptTheDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
//   try {
//     const distributeId = req.params.distributeId;
//     console.log("🚀 ~ acceptTheDistributeHandler ~ distributeId:", distributeId);

//     const updatedDistribute = await findAndUpdateDistribute({ distributeId }, req.body, {
//       new: true,
//     });

//     return res.status(200).json({
//       status: "success",
//       msg: "Update success",
//       data: updatedDistribute,
//     });
//   } catch (error: any) {
//     console.error("Error:", error.message);
//     next(new AppError("Internal server error", 500));
//   }
// }

// export async function deleteDistributeHandler(req: Request<UpdateDistributeInput["params"]>, res: Response, next: NextFunction) {
//   try {
//     const distributeId = req.params.distributeId;
//     const distribute = await findDistribute({ distributeId });

//     if (!distribute) {
//       next(new AppError("distribute does not exist", 404));
//       return;
//     }

//     await deleteDistribute({ distributeId });
//     return res.json({
//       status: "success",
//       msg: "Delete success",
//       data: {},
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }
