import express from "express";
import { validate } from "../middleware/validateResource";
import { createBranchInventoryHandler, getAllBranchInventoryHandler, getBranchInventoryHandler, updateBranchInventoryHandler, deleteBranchInventoryHandler } from "../controller/branchInventory.controller";
import { createBranchInventorySchema, getAllBranchInventorySchema, getBranchInventorySchema, updateBranchInventorySchema, deleteBranchInventorySchema } from "../schema/branchInventory.schema";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.post("/", [requireAdmin, validate(createBranchInventorySchema)], createBranchInventoryHandler);
router.get("/", [validate(getAllBranchInventorySchema)], getAllBranchInventoryHandler);
router.get("/:branchInventoryId", [validate(getBranchInventorySchema)], getBranchInventoryHandler);
router.patch("/:branchInventoryId", [requireAdmin, validate(updateBranchInventorySchema)], updateBranchInventoryHandler);
router.delete("/:branchInventoryId", [requireAdmin, validate(deleteBranchInventorySchema)], deleteBranchInventoryHandler);

export default router;
