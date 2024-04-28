import express from "express";
import { validate } from "../middleware/validateResource";
import { createSaleHandler, updateSaleHandler, getSaleHandler, getAllSaleHandler, deleteSaleHandler, getAllSaleByMonthHandler, deleteSalesByMonthHandler, getSalesByBranchAndDateHandler } from "../controller/sale.controller";
import { updateSaleSchema, getSaleSchema, getAllSaleSchema, deleteSaleSchema } from "../schema/sale.schema";

const router = express.Router();

router.post("/", createSaleHandler);
router.get("/", [validate(getAllSaleSchema)], getAllSaleHandler);
router.get("/:saleId", [validate(getSaleSchema)], getSaleHandler);
router.patch("/:saleId", [validate(updateSaleSchema)], updateSaleHandler);
router.delete("/:saleId", [validate(deleteSaleSchema)], deleteSaleHandler);
router.get("/get-sales-by-months/:branchId", getAllSaleByMonthHandler);


router.delete("/delete-sales-by-month/:branchId/:date", deleteSalesByMonthHandler);
router.get("/get-sales-by-branch-and-date/:branchId/:date", getSalesByBranchAndDateHandler);

export default router;
