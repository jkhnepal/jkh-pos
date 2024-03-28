import express from "express";
import { getBranchProfitHandler, getBranchStatHandler, getHeadquarterStatHandler } from "../controller/stat.controller";
const router = express.Router();

router.get("/headquarter", getHeadquarterStatHandler);
router.get("/branch", getBranchStatHandler);

router.get("/branch/branch-profit", getBranchProfitHandler);

export default router;
