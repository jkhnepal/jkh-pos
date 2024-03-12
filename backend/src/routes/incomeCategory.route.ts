import express from "express";
import { validate } from "../middleware/validateResource";
import { createIncomeCategoryHandler, updateIncomeCategoryHandler, getIncomeCategoryHandler, getAllIncomeCategoryHandler, deleteIncomeCategoryHandler } from "../controller/incomeCategory.controller";
import { createIncomeCategorySchema, updateIncomeCategorySchema, getIncomeCategorySchema, getAllIncomeCategorySchema, deleteIncomeCategorySchema } from "../schema/incomeCategory.schema";

const router = express.Router();

router.post("/", [validate(createIncomeCategorySchema)], createIncomeCategoryHandler);
router.patch("/:incomeCategoryId", [validate(updateIncomeCategorySchema)], updateIncomeCategoryHandler);
router.get("/:incomeCategoryId", [validate(getIncomeCategorySchema)], getIncomeCategoryHandler);
router.get("/", [validate(getAllIncomeCategorySchema)], getAllIncomeCategoryHandler);
router.delete("/:incomeCategoryId", [validate(deleteIncomeCategorySchema)], deleteIncomeCategoryHandler);

export default router;
