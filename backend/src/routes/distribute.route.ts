import express from "express";
import { validate } from "../middleware/validateResource";
import { createDistributeHandler, updateDistributeHandler, getDistributeHandler, getAllDistributeHandler, deleteDistributeHandler } from "../controller/distribute.controller";
import { createDistributeSchema, updateDistributeSchema, getDistributeSchema, getAllDistributeSchema, deleteDistributeSchema } from "../schema/distribute.schama";

const router = express.Router();

router.post("/", [validate(createDistributeSchema)], createDistributeHandler);
router.patch("/:distributeId", [validate(updateDistributeSchema)], updateDistributeHandler);
router.get("/:distributeId", [validate(getDistributeSchema)], getDistributeHandler);
router.get("/", [validate(getAllDistributeSchema)], getAllDistributeHandler);
router.delete("/:distributeId", [validate(deleteDistributeSchema)], deleteDistributeHandler);

export default router;
