import express from "express";
import { validate } from "../middleware/validateResource";
import { createUnitHandler, updateUnitHandler, getUnitHandler, getAllUnitHandler, deleteUnitHandler } from "../controller/unit.controller";
import { createUnitSchema, getUnitSchema, deleteUnitSchema, updateUnitSchema, getAllUnitSchema } from "../schema/unit.schems";
const router = express.Router();

router.post("/", [validate(createUnitSchema)], createUnitHandler);
router.patch("/:unitId", [validate(updateUnitSchema)], updateUnitHandler);
router.get("/:unitId", [validate(getUnitSchema)], getUnitHandler);
router.get("/", [validate(getAllUnitSchema)], getAllUnitHandler);
router.delete("/:unitId", [validate(deleteUnitSchema)], deleteUnitHandler);

export default router;
