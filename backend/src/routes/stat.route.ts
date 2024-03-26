import express from "express";
import { getBranchStatHandler, getHeadquarterStatHandler } from "../controller/stat.controller";
const router = express.Router();

router.get("/headquarter", getHeadquarterStatHandler);
router.get("/branch", getBranchStatHandler);

export default router;
