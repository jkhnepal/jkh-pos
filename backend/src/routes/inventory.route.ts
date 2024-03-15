import express from "express";
import { validate } from "../middleware/validateResource";
import { createInventoryHandler, updateInventoryHandler, getInventoryHandler, getAllInventoryHandler, deleteInventoryHandler, getInventoryStatOfAProductHandler } from "../controller/inventory.controller";
import { createInventorySchema, updateInventorySchema, getInventorySchema, getAllInventorySchema, deleteInventorySchema } from "../schema/inventory.schema";

const router = express.Router();

router.post("/", [validate(createInventorySchema)], createInventoryHandler);
router.patch("/:inventoryId", [validate(updateInventorySchema)], updateInventoryHandler);
router.get("/:inventoryId", [validate(getInventorySchema)], getInventoryHandler);
router.get("/", [validate(getAllInventorySchema)], getAllInventoryHandler);
router.delete("/:inventoryId", [validate(deleteInventorySchema)], deleteInventoryHandler);

router.get("/inventory-stat-of-a-product/:inventoryId", [validate(getInventorySchema)], getInventoryStatOfAProductHandler); //inventoryId->product
export default router;
