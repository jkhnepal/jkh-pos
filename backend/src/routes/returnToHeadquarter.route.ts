import express from "express";
import { validate } from "../middleware/validateResource";
import { createReturnToHeadquarterHandler, getAllReturnHistory, resetDatabaseAfter3MonthHandler } from "../controller/returnToHeadquarterController";
import { createReturnToHeadquarterSchema } from "../schema/returnToHeadquarter.schema";

const router = express.Router();

// CREATE NEW RETURN TO HEADQUARTER 
// wehn a branch return products to headquarter
router.post("/", [validate(createReturnToHeadquarterSchema)], createReturnToHeadquarterHandler);

// reset database after 3 months
router.post("/reset-database-after-3-months/:branchId", resetDatabaseAfter3MonthHandler);

// GET ALL RETURN HISTORY
router.get("/", getAllReturnHistory);

export default router;
