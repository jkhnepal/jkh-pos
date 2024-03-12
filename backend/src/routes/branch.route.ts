import express from "express";
import { validate } from "../middleware/validateResource";
import { createBranchHandler, updateBranchHandler, getBranchHandler, getAllBranchHandler, deleteBranchHandler } from "../controller/branch.controller";
import { createBranchSchema, updateBranchSchema, getBranchSchema, getAllBranchSchema, deleteBranchSchema } from "../schema/branch.schems";

const router = express.Router();

router.post("/", [validate(createBranchSchema)], createBranchHandler);
router.patch("/:branchId", [validate(updateBranchSchema)], updateBranchHandler);
router.get("/:branchId", [validate(getBranchSchema)], getBranchHandler);
router.get("/", [validate(getAllBranchSchema)], getAllBranchHandler);
router.delete("/:branchId", [validate(deleteBranchSchema)], deleteBranchHandler);

export default router;
