import express from "express";
import { authenticateToken, getUserFromTokenHandler } from "../controller/user.controller";
import { getBranchFromTokenHandler } from "../controller/branch.controller";

const router = express.Router();

router.get("/get-current-admin", authenticateToken, getBranchFromTokenHandler);

export default router;
