import express from "express";
import { authenticateToken, createUserHandler, deleteUserHandler, getAllUserHandler, getUserByUsernameHandler, getUserFromTokenHandler, getUserHandler, loginUserHandler, updateUserHandler, verifyEmailHander } from "../controller/user.controller";
import { createUserSchema, getUserSchema, loginUserSchema, updateUserSchema } from "../schema/user.schema";
import { validate } from "../middleware/validateResource";

const router = express.Router();

// REGISTER NEW BRANCH
//-->register new branch alog with sending email confirmaton link
router.post("/register", [validate(createUserSchema)], createUserHandler);

// LOGIN USER
router.post("/login", [validate(loginUserSchema)], loginUserHandler);

// UPDATE USER
router.patch("/:userId", [validate(updateUserSchema)], updateUserHandler);

// GET USER FROM USER ID
router.get("/:userId", validate(getUserSchema), getUserHandler);

// GET ALL USERS
router.get("/", getAllUserHandler);

// DELETE USER
router.delete("/:userId", deleteUserHandler);

// GET USER DETAIL FROM TOKEN (ACCESS TOKEN PASSEED IN HEADER)
router.get("/get-user-from-token/:pass-token-in-header", authenticateToken, getUserFromTokenHandler);

// VERIFY EMAIL
router.get("/verify-email/:token", verifyEmailHander);

// GET USER BY USERNAME
router.get("/username/:username", getUserByUsernameHandler);

export default router;
