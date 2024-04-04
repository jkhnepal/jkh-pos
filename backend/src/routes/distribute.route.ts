import express from "express";
import { validate } from "../middleware/validateResource";
import { createDistributeHandler, updateDistributeHandler, getDistributeHandler, getAllDistributeHandler, deleteDistributeHandler, getAllUniqueProductInventoryOfABranchHandler, getAllDistributeOfABranchHandler, acceptTheDistributeHandler } from "../controller/distribute.controller";
import { createDistributeSchema, updateDistributeSchema, getDistributeSchema, getAllDistributeSchema, deleteDistributeSchema } from "../schema/distribute.schama";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.post("/", [requireAdmin,validate(createDistributeSchema)], createDistributeHandler);
router.patch("/:distributeId", [requireAdmin,validate(updateDistributeSchema)], updateDistributeHandler);
router.get("/:distributeId", [validate(getDistributeSchema)], getDistributeHandler);
router.get("/", [validate(getAllDistributeSchema)], getAllDistributeHandler);
router.delete("/:distributeId", [requireAdmin,validate(deleteDistributeSchema)], deleteDistributeHandler);
router.get("/inventory-of-a-branch/loki", [validate(getAllDistributeSchema)], getAllUniqueProductInventoryOfABranchHandler);

router.get("/loki/loki/distributes-of-a-branch", [validate(getAllDistributeSchema)], getAllDistributeOfABranchHandler);

router.patch("/accept-the-distribute/:distributeId", [validate(updateDistributeSchema)], acceptTheDistributeHandler);



export default router;
