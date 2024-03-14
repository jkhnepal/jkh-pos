import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateProductInput, UpdateProductInput } from "../schema/product.schema";
import { findProduct, createProduct, findAllProduct, findAndUpdateProduct, deleteProduct } from "../service/product.service";

var colors = require("colors");

export async function createProductHandler(req: Request<{}, {}, CreateProductInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findProduct({ name: body.name });

    if (alreadyExist) {
      next(new AppError(`product with the name (${body.name}) already exist`, 404));
      return;
    }

    const product = await createProduct(body);
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

export async function getAllProductHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    const results = await findAllProduct(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all product success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
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
