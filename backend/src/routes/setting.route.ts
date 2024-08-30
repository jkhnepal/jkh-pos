import express from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { createSettingHandler, deleteSettingHandler, getAllSettingHandler, getSettingHandler, updateSettingHandler } from "../controller/setting.controller";

const router = express.Router();

// CREATE NEW SETTING
router.post("/", [requireAdmin], createSettingHandler);

// UPDATE SETTING
router.patch("/:settingId", [requireAdmin], updateSettingHandler);

// GET SETTING BY ID
router.get("/:settingId", getSettingHandler);

// GET ALL SETTING
router.get("/", getAllSettingHandler);

// DELETE SETTING
router.delete("/:settingId", [requireAdmin], deleteSettingHandler);

export default router;
