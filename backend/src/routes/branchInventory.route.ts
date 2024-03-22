import express from "express";
import { validate } from "../middleware/validateResource";
import { createBranchInventoryHandler, getAllBranchInventoryHandler, getBranchInventoryHandler, updateBranchInventoryHandler, deleteBranchInventoryHandler } from "../controller/branchInventory.controller";
import { createBranchInventorySchema, getAllBranchInventorySchema, getBranchInventorySchema, updateBranchInventorySchema, deleteBranchInventorySchema } from "../schema/branchInventory.schema";

const router = express.Router();

router.post("/", [validate(createBranchInventorySchema)], createBranchInventoryHandler);
router.get("/", [validate(getAllBranchInventorySchema)], getAllBranchInventoryHandler);
router.get("/:branchInventoryId", [validate(getBranchInventorySchema)], getBranchInventoryHandler);
router.patch("/:branchInventoryId", [validate(updateBranchInventorySchema)], updateBranchInventoryHandler);
router.delete("/:branchInventoryId", [validate(deleteBranchInventorySchema)], deleteBranchInventoryHandler);

export default router;
