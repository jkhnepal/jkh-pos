import express from "express";
import { validate } from "../middleware/validateResource";
import { createProductHandler, updateProductHandler, getProductHandler, getAllProductHandler, deleteProductHandler, getProductBySkuHandler } from "../controller/product.controller";
import { createProductSchema, updateProductSchema, getProductSchema, getAllProductSchema, deleteProductSchema } from "../schema/product.schema";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.post("/", [requireAdmin,validate(createProductSchema)], createProductHandler);
router.patch("/:productId", [requireAdmin,validate(updateProductSchema)], updateProductHandler);
router.get("/:productId", [validate(getProductSchema)], getProductHandler);
router.get("/", [validate(getAllProductSchema)], getAllProductHandler);
router.delete("/:productId", [requireAdmin, validate(deleteProductSchema)], deleteProductHandler);
router.get("/sku/:productId", [validate(getProductSchema)], getProductBySkuHandler); //productId->sku

export default router;
