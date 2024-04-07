import express from "express";
import { validate } from "../middleware/validateResource";
import { createBranchHandler, updateBranchHandler, getBranchHandler, getAllBranchHandler, deleteBranchHandler, loginBranchHandler, resetPasswordHandler, resetBranchPasswordHandler } from "../controller/branch.controller";
import { createBranchSchema, updateBranchSchema, getBranchSchema, getAllBranchSchema, deleteBranchSchema } from "../schema/branch.schems";
import { loginSchema } from "../schema/login.schema";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.post("/", [requireAdmin, validate(createBranchSchema)], createBranchHandler);
router.patch("/:branchId", [requireAdmin, validate(updateBranchSchema)], updateBranchHandler);
router.get("/:branchId", [validate(getBranchSchema)], getBranchHandler);
router.get("/", [validate(getAllBranchSchema)], getAllBranchHandler);
router.delete("/:branchId", [requireAdmin, validate(deleteBranchSchema)], deleteBranchHandler);
router.post("/login", [validate(loginSchema)], loginBranchHandler);
// router.patch("/reset-password/:branchId",requireAdmin, resetPasswordHandler); // branchId->email

router.patch("/reset-password/:email",requireAdmin, resetBranchPasswordHandler);

export default router;
