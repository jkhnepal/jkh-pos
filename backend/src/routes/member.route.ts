import express from "express";
import { validate } from "../middleware/validateResource";
import { createMemberHandler, updateMemberHandler, getMemberHandler, getAllMemberHandler, deleteMemberHandler, getMemberByPhoneHandler } from "../controller/member.controller";
import { createMemberSchema, updateMemberSchema, getMemberSchema, getAllMemberSchema, deleteMemberSchema } from "../schema/member.schema";

const router = express.Router();

router.post("/", [validate(createMemberSchema)], createMemberHandler);
router.patch("/:memberId", [validate(updateMemberSchema)], updateMemberHandler);
router.get("/:memberId", [validate(getMemberSchema)], getMemberHandler);
router.get("/by-phone/:memberId", [validate(getMemberSchema)], getMemberByPhoneHandler); // memberId-->phone
router.get("/", [validate(getAllMemberSchema)], getAllMemberHandler);
router.delete("/:memberId", [validate(deleteMemberSchema)], deleteMemberHandler);

export default router;
