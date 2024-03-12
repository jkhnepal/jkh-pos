import express from "express";
import { validate } from "../middleware/validateResource";
import { createTypeHandler, updateTypeHandler, getTypeHandler, getAllTypeHandler, deleteTypeHandler } from "../controller/type.controller";
import { createTypeSchema, getTypeSchema, deleteTypeSchema, getAllTypeSchema, updateTypeSchema } from "../schema/type.schema";
const router = express.Router();

router.post("/", [validate(createTypeSchema)], createTypeHandler);
router.patch("/:typeId", [validate(updateTypeSchema)], updateTypeHandler);
router.get("/:typeId", [validate(getTypeSchema)], getTypeHandler);
router.get("/", [validate(getAllTypeSchema)], getAllTypeHandler);
router.delete("/:typeId", [validate(deleteTypeSchema)], deleteTypeHandler);

export default router;
