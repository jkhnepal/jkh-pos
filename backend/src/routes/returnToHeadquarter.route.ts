import express from "express";
import { validate } from "../middleware/validateResource";
import { createReturnToHeadquarterHandler, getAllReturnHistory, resetDatabaseAfter3MonthHandler } from "../controller/returnToHeadquarterController";
import { createReturnToHeadquarterSchema } from "../schema/returnToHeadquarter.schema";

const router = express.Router();

router.post("/", [validate(createReturnToHeadquarterSchema)], createReturnToHeadquarterHandler);
router.post("/reset-database-after-3-months/:branchId", resetDatabaseAfter3MonthHandler);
router.get("/", getAllReturnHistory);

export default router;
