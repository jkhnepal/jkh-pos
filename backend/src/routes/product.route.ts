import express from "express";
import { validate } from "../middleware/validateResource";
import { createProductHandler, updateProductHandler, getProductHandler, getAllProductHandler, deleteProductHandler, getProductBySkuHandler } from "../controller/product.controller";
import { createProductSchema, updateProductSchema, getProductSchema, getAllProductSchema, deleteProductSchema } from "../schema/product.schema";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();
// CREATE NEW PRODUCT
router.post("/", [requireAdmin,validate(createProductSchema)], createProductHandler);


// UPDATE PRODUCT
router.patch("/:productId", [requireAdmin,validate(updateProductSchema)], updateProductHandler);

// GET PRODUCT BY ID
router.get("/:productId", [validate(getProductSchema)], getProductHandler);

// GET ALL PRODUCT
router.get("/", [validate(getAllProductSchema)], getAllProductHandler);

// DELETE PRODUCT
router.delete("/:productId", [requireAdmin, validate(deleteProductSchema)], deleteProductHandler);

// GET PRODUCT BY SKU
router.get("/sku/:productId", [validate(getProductSchema)], getProductBySkuHandler); //productId->sku

export default router;
