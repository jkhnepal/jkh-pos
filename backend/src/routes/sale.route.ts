import express from "express";
import { validate } from "../middleware/validateResource";
import { createSaleHandler, updateSaleHandler, getSaleHandler, getAllSaleHandler, deleteSaleHandler } from "../controller/sale.controller";
import { createSaleSchema, updateSaleSchema, getSaleSchema, getAllSaleSchema, deleteSaleSchema } from "../schema/sale.schema";

const router = express.Router();

router.post("/", [validate(createSaleSchema)], createSaleHandler);
router.patch("/:saleId", [validate(updateSaleSchema)], updateSaleHandler);
router.get("/:saleId", [validate(getSaleSchema)], getSaleHandler);
router.get("/", [validate(getAllSaleSchema)], getAllSaleHandler);
router.delete("/:saleId", [validate(deleteSaleSchema)], deleteSaleHandler);

export default router;
