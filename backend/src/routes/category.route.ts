import express from "express";
import { validate } from "../middleware/validateResource";
import { createCategoryHandler, updateCategoryHandler, getCategoryHandler, getAllCategoryHandler, deleteCategoryHandler } from "../controller/category.controller";
import { createCategorySchema, getCategorySchema, deleteCategorySchema, updateCategorySchema, getAllCategorySchema } from "../schema/category.schema";
import { requireAdmin } from "../middleware/requireAdmin";
const router = express.Router();

// CREATE NEW CATEGORY
router.post("/", [requireAdmin,validate(createCategorySchema)], createCategoryHandler);

// UPDATE CATEGORY
router.patch("/:categoryId", [requireAdmin,validate(updateCategorySchema)], updateCategoryHandler);

// GET CATEGORY BY ID
router.get("/:categoryId", [validate(getCategorySchema)], getCategoryHandler);

// GET ALL CATEGORY
router.get("/", [validate(getAllCategorySchema)], getAllCategoryHandler);

// DELETE CATEGORY
router.delete("/:categoryId", [requireAdmin,validate(deleteCategorySchema)], deleteCategoryHandler);

export default router;
