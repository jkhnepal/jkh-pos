import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateProductInput, UpdateProductInput } from "../schema/product.schema";
import { findProduct, createProduct, findAllProduct, findAndUpdateProduct, deleteProduct } from "../service/product.service";
import ProductModel, { ProductDocument } from "../models/product.model";
import { createHeadquarterInventory } from "../service/headquarterInventory.service";

var colors = require("colors");

export async function createProductHandler(req: Request<{}, {}, CreateProductInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findProduct({ name: body.name });

    if (alreadyExist) {
      return res.status(404).json({
        status: "failure",
        msg: `product with the name (${body.name}) already exist`,
      });
    }

    const product = await createProduct(body);

    // Also create its headquarterInventory
    await createHeadquarterInventory({ product: product?._id, totalStock: 0 });

    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: product,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

// export async function getAllProductHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
//   try {
//     const queryParameters = req.query;

//     const results = await findAllProduct(queryParameters);
//     console.log(results)
//     return res.json({
//       status: "success",
//       msg: "Get all product success",
//       data: results,
//     });
//   } catch (error: any) {
//     console.error(colors.red("msg:", error.message));
//     next(new AppError("Internal server error", 500));
//   }
// }

export async function getAllProductHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    // Aggregate query to get products with totalAddedStock and totalDistributedStock
    const productsWithStockData = await ProductModel.aggregate([
      { $match: queryParameters },
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "product",
          as: "inventory",
        },
      },
      {
        $lookup: {
          from: "distributes",
          localField: "_id",
          foreignField: "product",
          as: "distribute",
        },
      },
      {
        $addFields: {
          totalAddedStock: { $sum: "$inventory.stock" },
          totalDistributedStock: { $sum: "$distribute.quantity" },
        },
      },
      {
        $project: {
          name: 1,
          sku: 1,
          category: 1,
          cp: 1,
          sp: 1,
          discount: 1,
          image: 1,
          note: 1,
          productId: 1,
          createdAt: 1,
          updatedAt: 1,
          totalAddedStock: 1,
          totalDistributedStock: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      msg: "Get all products success",
      data: productsWithStockData,
    });
  } catch (error) {
    console.error("Error:", error);
    next(new Error("Internal server error"));
  }
}

export async function getProductHandler(req: Request<UpdateProductInput["params"]>, res: Response, next: NextFunction) {
  try {
    const productId = req.params.productId;
    const product = await findProduct({ productId });

    if (!product) {
      next(new AppError("product does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: product,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getProductBySkuHandler(req: Request<UpdateProductInput["params"]>, res: Response, next: NextFunction) {
  try {
    const sku = req.params.productId;
    const product = await findProduct({ sku });

    if (!product) {
      return res.status(404).json({
        status: "failure",
        msg: "Product does not exist",
      });
    }

    return res.status(200).json({
      status: "success",
      msg: "Get success",
      data: product,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateProductHandler(req: Request<UpdateProductInput["params"]>, res: Response, next: NextFunction) {
  try {
    const productId = req.params.productId;
    const product: any = await findProduct({ productId });

    if (!product) {
      next(new AppError("Product does not exist", 404));
      return;
    }

    const updatedProduct = await findAndUpdateProduct({ productId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteProductHandler(req: Request<UpdateProductInput["params"]>, res: Response, next: NextFunction) {
  try {
    const productId = req.params.productId;
    const product = await findProduct({ productId });

    if (!product) {
      next(new AppError("product does not exist", 404));
      return;
    }

    await deleteProduct({ productId });
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
