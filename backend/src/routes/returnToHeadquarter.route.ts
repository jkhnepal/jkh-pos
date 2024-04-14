import express from "express";
import { validate } from "../middleware/validateResource";
import { createReturnToHeadquarterHandler } from "../controller/returnToHeadquarterController";
import { createReturnToHeadquarterSchema } from "../schema/returnToHeadquarter.schema";

const router = express.Router();

router.post("/", [validate(createReturnToHeadquarterSchema)], createReturnToHeadquarterHandler);

export default router;
