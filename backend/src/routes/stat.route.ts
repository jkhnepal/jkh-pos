import express from "express";
import { getBranchProfitHandler, getBranchStatHandler, getHeadquarterStatHandler } from "../controller/stat.controller";
const router = express.Router();

// GET HEADQUARTER STAT
router.get("/headquarter", getHeadquarterStatHandler);

// GET BRANCH STAT
router.get("/branch", getBranchStatHandler);

// GET BRANCH PROFIT
router.get("/branch/branch-profit", getBranchProfitHandler);

export default router;
