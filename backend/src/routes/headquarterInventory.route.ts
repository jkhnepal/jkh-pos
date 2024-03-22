import express from "express";
import { validate } from "../middleware/validateResource";
import { createHeadquarterInventoryHandler, updateHeadquarterInventoryHandler, getHeadquarterInventoryHandler, getAllHeadquarterInventoryHandler, deleteHeadquarterInventoryHandler, getHeadquarterInventoryByProductHandler } from "../controller/headquarterInventory.controller";
import { createHeadquarterInventorySchema, updateHeadquarterInventorySchema, getHeadquarterInventorySchema, getAllHeadquarterInventorySchema, deleteHeadquarterInventorySchema } from "../schema/headquarterInventory.schema";

const router = express.Router();

router.post("/", [validate(createHeadquarterInventorySchema)], createHeadquarterInventoryHandler);
router.get("/", [validate(getAllHeadquarterInventorySchema)], getAllHeadquarterInventoryHandler);
router.get("/:headquarterInventoryId", [validate(getHeadquarterInventorySchema)], getHeadquarterInventoryHandler);
router.patch("/:headquarterInventoryId", [validate(updateHeadquarterInventorySchema)], updateHeadquarterInventoryHandler);
router.delete("/:headquarterInventoryId", [validate(deleteHeadquarterInventorySchema)], deleteHeadquarterInventoryHandler);

//headquarterInventoryId->product
router.get("/get-headquarter-inventory-by-product/:headquarterInventoryId", [validate(getHeadquarterInventorySchema)], getHeadquarterInventoryByProductHandler);

export default router;
