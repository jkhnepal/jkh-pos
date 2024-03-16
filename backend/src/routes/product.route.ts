import express from "express";
import { validate } from "../middleware/validateResource";
import { createProductHandler, updateProductHandler, getProductHandler, getAllProductHandler, deleteProductHandler, getProductBySkuHandler } from "../controller/product.controller";
import { createProductSchema, updateProductSchema, getProductSchema, getAllProductSchema, deleteProductSchema } from "../schema/product.schema";

const router = express.Router();

router.post("/", [validate(createProductSchema)], createProductHandler);
router.patch("/:productId", [validate(updateProductSchema)], updateProductHandler);
router.get("/:productId", [validate(getProductSchema)], getProductHandler);
router.get("/", [validate(getAllProductSchema)], getAllProductHandler);
router.delete("/:productId", [validate(deleteProductSchema)], deleteProductHandler);
router.get("/sku/:productId", [validate(getProductSchema)], getProductBySkuHandler); //productId->sku

export default router;
