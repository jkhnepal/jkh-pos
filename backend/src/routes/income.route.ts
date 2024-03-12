import express from "express";
import { validate } from "../middleware/validateResource";
import { createIncomeHandler, updateIncomeHandler, getIncomeHandler, getAllIncomeHandler, deleteIncomeHandler } from "../controller/income.controller";
import { createIncomeSchema, updateIncomeSchema, getIncomeSchema, getAllIncomeSchema, deleteIncomeSchema } from "../schema/income.schema";

const router = express.Router();

router.post("/", [validate(createIncomeSchema)], createIncomeHandler);
router.patch("/:incomeId", [validate(updateIncomeSchema)], updateIncomeHandler);
router.get("/:incomeId", [validate(getIncomeSchema)], getIncomeHandler);
router.get("/", [validate(getAllIncomeSchema)], getAllIncomeHandler);
router.delete("/:incomeId", [validate(deleteIncomeSchema)], deleteIncomeHandler);

export default router;
