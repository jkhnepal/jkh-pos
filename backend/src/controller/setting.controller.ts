import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
var colors = require("colors");
import { createSetting, findAllSetting, findAndUpdateSetting, findSetting } from "../service/setting.service";

export async function createSettingHandler(req: Request<{}, {}, any>, res: Response, next: NextFunction) {
  try {
    const setting = await createSetting(req.body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: setting,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllSettingHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const results = await findAllSetting();
    return res.json({
      status: "success",
      msg: "Get all setting success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getSettingHandler(req: any, res: Response, next: NextFunction) {
  try {
    const settingId = req.params.settingId;
    const setting = await findSetting({ settingId });

    if (!setting) {
      next(new AppError("Setting does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: setting,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function updateSettingHandler(req: any, res: Response, next: NextFunction) {
  try {
    const settingId = req.params.settingId;
    const setting: any = await findSetting({ settingId });

    if (!setting) {
      next(new AppError("Setting does not exist", 404));
      return;
    }

    const updatedSetting = await findAndUpdateSetting({ settingId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedSetting,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteSettingHandler(req: any, res: Response, next: NextFunction) {
  try {
    const settingId = req.params.settingId;
    const setting = await findSetting({ settingId });

    if (!setting) {
      next(new AppError("Setting does not exist", 404));
      return;
    }

    return res.json({
      status: "success",
      msg: "Delete success",
      data: {},
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
