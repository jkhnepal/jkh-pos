import express from "express";
import { validate } from "../middleware/validateResource";
import { createSaleHandler, updateSaleHandler, getSaleHandler, getAllSaleHandler, deleteSaleHandler, getAllSaleOfAMemberHandler } from "../controller/sale.controller";
import { createSaleSchema, updateSaleSchema, getSaleSchema, getAllSaleSchema, deleteSaleSchema } from "../schema/sale.schema";

const router = express.Router();

// router.post("/", [validate(createSaleSchema)], createSaleHandler);
router.post("/", createSaleHandler);
router.get("/", [validate(getAllSaleSchema)], getAllSaleHandler);
router.get("/:saleId", [validate(getSaleSchema)], getSaleHandler);
router.patch("/:saleId", [validate(updateSaleSchema)], updateSaleHandler);
router.delete("/:saleId", [validate(deleteSaleSchema)], deleteSaleHandler);

router.get("/loki/sales-of-a-member", [validate(getAllSaleSchema)], getAllSaleOfAMemberHandler);

export default router;
