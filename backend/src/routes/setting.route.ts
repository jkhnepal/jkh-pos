import express from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { createSettingHandler, deleteSettingHandler, getAllSettingHandler, getSettingHandler, updateSettingHandler } from "../controller/setting.controller";

const router = express.Router();

router.post("/", [requireAdmin], createSettingHandler);
router.patch("/:settingId", [requireAdmin], updateSettingHandler);
router.get("/:settingId", getSettingHandler);
router.get("/", getAllSettingHandler);
router.delete("/:settingId", [requireAdmin], deleteSettingHandler);

export default router;
