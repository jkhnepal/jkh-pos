import express from "express";
import { validate } from "../middleware/validateResource";
import { createCategoryHandler, updateCategoryHandler, getCategoryHandler, getAllCategoryHandler, deleteCategoryHandler } from "../controller/category.controller";
import { createCategorySchema, getCategorySchema, deleteCategorySchema, updateCategorySchema, getAllCategorySchema } from "../schema/category.schema";
import { requireAdmin } from "../middleware/requireAdmin";
const router = express.Router();

router.post("/", [requireAdmin,validate(createCategorySchema)], createCategoryHandler);
router.patch("/:categoryId", [requireAdmin,validate(updateCategorySchema)], updateCategoryHandler);
router.get("/:categoryId", [validate(getCategorySchema)], getCategoryHandler);
router.get("/", [validate(getAllCategorySchema)], getAllCategoryHandler);
router.delete("/:categoryId", [requireAdmin,validate(deleteCategorySchema)], deleteCategoryHandler);

export default router;
