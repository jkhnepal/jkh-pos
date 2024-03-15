import express from "express";
import { getHeadquarterStatHandler } from "../controller/stat.controller";

const router = express.Router();

router.get("/headquarter/:inventoryId", getHeadquarterStatHandler);

export default router;
