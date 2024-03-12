import express from "express";
import { validate } from "../middleware/validateResource";
import { createExpenseHandler, updateExpenseHandler, getExpenseHandler, getAllExpenseHandler, deleteExpenseHandler } from "../controller/expense.controller";
import { createExpenseSchema, updateExpenseSchema, getExpenseSchema, getAllExpenseSchema, deleteExpenseSchema } from "../schema/expense.schema";

const router = express.Router();

router.post("/", [validate(createExpenseSchema)], createExpenseHandler);
router.patch("/:expenseId", [validate(updateExpenseSchema)], updateExpenseHandler);
router.get("/:expenseId", [validate(getExpenseSchema)], getExpenseHandler);
router.get("/", [validate(getAllExpenseSchema)], getAllExpenseHandler);
router.delete("/:expenseId", [validate(deleteExpenseSchema)], deleteExpenseHandler);

export default router;
