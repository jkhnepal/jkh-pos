import express from "express";
import { validate } from "../middleware/validateResource";
import { createBranchHandler, updateBranchHandler, getBranchHandler, getAllBranchHandler, deleteBranchHandler, loginBranchHandler, resetPasswordHandler } from "../controller/branch.controller";
import { createBranchSchema, updateBranchSchema, getBranchSchema, getAllBranchSchema, deleteBranchSchema } from "../schema/branch.schems";
import { loginSchema } from "../schema/login.schema";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.post("/", [requireAdmin, validate(createBranchSchema)], createBranchHandler);
router.patch("/:branchId", [validate(updateBranchSchema)], updateBranchHandler);
router.get("/:branchId", [validate(getBranchSchema)], getBranchHandler);
router.get("/", [validate(getAllBranchSchema)], getAllBranchHandler);
router.delete("/:branchId", [validate(deleteBranchSchema)], deleteBranchHandler);
router.post("/login", [validate(loginSchema)], loginBranchHandler);
router.patch("/reset-password/:branchId", resetPasswordHandler); // branchId->email

export default router;
