import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CreateMemberInput, UpdateMemberInput } from "../schema/member.schema";
import { findMember, createMember, findAllMember, findAndUpdateMember, deleteMember } from "../service/member.service";
var colors = require("colors");

export async function createMemberHandler(req: Request<{}, {}, CreateMemberInput["body"]>, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const alreadyExist = await findMember({ phone: body.phone });

    if (alreadyExist) {
      next(new AppError(`member with the phone (${body.phone}) already exist`, 404));
      return;
    }

    const member = await createMember(body);
    return res.status(201).json({
      status: "success",
      msg: "Create success",
      data: member,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllMemberHandler(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
  try {
    const queryParameters = req.query;

    const results = await findAllMember(queryParameters);
    return res.json({
      status: "success",
      msg: "Get all member success",
      data: results,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getMemberHandler(req: Request<UpdateMemberInput["params"]>, res: Response, next: NextFunction) {
  try {
    const memberId = req.params.memberId;
    const member = await findMember({ memberId });

    if (!member) {
      next(new AppError("member does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: member,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getMemberByPhoneHandler(req: Request<UpdateMemberInput["params"]>, res: Response, next: NextFunction) {
  try {
    const phone = req.params.memberId;
    const member = await findMember({ phone });

    if (!member) {
      next(new AppError("member does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: member,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}


export async function updateMemberHandler(req: Request<UpdateMemberInput["params"]>, res: Response, next: NextFunction) {
  try {
    const memberId = req.params.memberId;
    const member: any = await findMember({ memberId });

    if (!member) {
      next(new AppError("Member does not exist", 404));
      return;
    }

    const updatedMember = await findAndUpdateMember({ memberId }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      msg: "Update success",
      data: updatedMember,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteMemberHandler(req: Request<UpdateMemberInput["params"]>, res: Response, next: NextFunction) {
  try {
    const memberId = req.params.memberId;
    const member = await findMember({ memberId });

    if (!member) {
      next(new AppError("member does not exist", 404));
      return;
    }

    await deleteMember({ memberId });
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
