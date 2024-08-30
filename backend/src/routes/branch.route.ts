import express from "express";
import { validate } from "../middleware/validateResource";
import { createBranchHandler, updateBranchHandler, getBranchHandler, getAllBranchHandler, deleteBranchHandler, loginBranchHandler, resetPasswordHandler, resetBranchPasswordHandler } from "../controller/branch.controller";
import { createBranchSchema, updateBranchSchema, getBranchSchema, getAllBranchSchema, deleteBranchSchema } from "../schema/branch.schems";
import { loginSchema } from "../schema/login.schema";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

// CREATE NEW BRANCH
router.post("/", [requireAdmin, validate(createBranchSchema)], createBranchHandler);

// UPDATE BRANCH
router.patch("/:branchId", [requireAdmin, validate(updateBranchSchema)], updateBranchHandler);

// GET BRANCH BY ID
router.get("/:branchId", [validate(getBranchSchema)], getBranchHandler);

// GET ALL BRANCH
router.get("/", [validate(getAllBranchSchema)], getAllBranchHandler);

// DELETE BRANCH
//->while deleting branch delete all its associated documents also like products, orders etc
router.delete("/:branchId", [requireAdmin, validate(deleteBranchSchema)], deleteBranchHandler);

// LOGIN BRANCH
router.post("/login", [validate(loginSchema)], loginBranchHandler);

// RESET BRANCH PASSWORD
router.patch("/reset-password/:email", requireAdmin, resetBranchPasswordHandler);

export default router;
