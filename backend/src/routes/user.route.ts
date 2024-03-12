import express from "express";
import { authenticateToken, createUserHandler, deleteUserHandler, getAllUserHandler, getUserByUsernameHandler, getUserFromTokenHandler, getUserHandler, loginUserHandler, updateUserHandler, verifyEmailHander } from "../controller/user.controller";
import { createUserSchema, getUserSchema, loginUserSchema, updateUserSchema } from "../schema/user.schema";
import { validate } from "../middleware/validateResource";

const router = express.Router();

router.post("/register", [validate(createUserSchema)], createUserHandler);
router.post("/login", [validate(loginUserSchema)], loginUserHandler);
router.patch("/:userId", [validate(updateUserSchema)], updateUserHandler);
router.get("/:userId", validate(getUserSchema), getUserHandler);
router.get("/", getAllUserHandler);
router.delete("/:userId", deleteUserHandler);

router.get("/get-user-from-token/:pass-token-in-header", authenticateToken, getUserFromTokenHandler);
router.get("/verify-email/:token", verifyEmailHander);

router.get("/username/:username", getUserByUsernameHandler);

export default router;
