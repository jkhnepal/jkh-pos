import express from "express";
import { validate } from "../middleware/validateResource";
import { createCategoryHandler, updateCategoryHandler, getCategoryHandler, getAllCategoryHandler, deleteCategoryHandler } from "../controller/category.controller";
import { createCategorySchema, getCategorySchema, deleteCategorySchema, updateCategorySchema, getAllCategorySchema } from "../schema/category.schema";
const router = express.Router();

router.post("/", [validate(createCategorySchema)], createCategoryHandler);
router.patch("/:categoryId", [validate(updateCategorySchema)], updateCategoryHandler);
router.get("/:categoryId", [validate(getCategorySchema)], getCategoryHandler);
router.get("/", [validate(getAllCategorySchema)], getAllCategoryHandler);
router.delete("/:categoryId", [validate(deleteCategorySchema)], deleteCategoryHandler);

export default router;
