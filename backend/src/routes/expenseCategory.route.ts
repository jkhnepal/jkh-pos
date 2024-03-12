import express from "express";
import { validate } from "../middleware/validateResource";
import { createExpenseCategoryHandler, updateExpenseCategoryHandler, getExpenseCategoryHandler, getAllExpenseCategoryHandler, deleteExpenseCategoryHandler } from "../controller/expenseCategory.controller";
import { createExpenseCategorySchema, updateExpenseCategorySchema, getExpenseCategorySchema, getAllExpenseCategorySchema, deleteExpenseCategorySchema } from "../schema/expenseCategory.schema";

const router = express.Router();

router.post("/", [validate(createExpenseCategorySchema)], createExpenseCategoryHandler);
router.patch("/:expenseCategoryId", [validate(updateExpenseCategorySchema)], updateExpenseCategoryHandler);
router.get("/:expenseCategoryId", [validate(getExpenseCategorySchema)], getExpenseCategoryHandler);
router.get("/", [validate(getAllExpenseCategorySchema)], getAllExpenseCategoryHandler);
router.delete("/:expenseCategoryId", [validate(deleteExpenseCategorySchema)], deleteExpenseCategoryHandler);

export default router;
