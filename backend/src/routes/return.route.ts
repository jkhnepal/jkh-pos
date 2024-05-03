import express from "express";
import { validate } from "../middleware/validateResource";
import { createReturnHandler, updateReturnHandler, getReturnHandler, getAllReturnHandler, deleteReturnHandler } from "../controller/return.controller";
import { createReturnSchema, updateReturnSchema, getReturnSchema, getAllReturnSchema, deleteReturnSchema } from "../schema/return.schema";

const router = express.Router();

router.post("/", [validate(createReturnSchema)], createReturnHandler);
router.patch("/:returnId", [validate(updateReturnSchema)], updateReturnHandler);
router.get("/:returnId", [validate(getReturnSchema)], getReturnHandler);
router.get("/", [validate(getAllReturnSchema)], getAllReturnHandler);
router.delete("/:returnId", [validate(deleteReturnSchema)], deleteReturnHandler);

export default router;
