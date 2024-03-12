import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { createUser, deleteUser, findAllUser, findAndUpdateUser, findUser, validatePassword } from "../service/user.service";
import { generateHashedPassword } from "../utils/generateHashedPassword";
import { CreateUserInput, LoginUserInput, UpdateUserInput } from "../schema/user.schema";
var colors = require("colors");
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import UserModel from "../models/user.model";
import crypto from "crypto";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response, next: NextFunction) {
  try {
    const existingUserWithEmail = await findUser({ email: req.body.email });
    if (existingUserWithEmail) {
      return next(new AppError("User with this email already exists", 409));
    }

    const existingUserWithUsername = await findUser({ username: req.body.username });
    if (existingUserWithUsername) {
      return next(new AppError("User with this username already exists", 409));
    }

    const token = crypto.randomBytes(20).toString("hex");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "lokendrachaulagain803@gmail.com",
        pass: "hvcf tefh hfjd tgop",
      },
    });

    const info = await transporter.sendMail({
      from: "epeak",
      to: req.body.email,
      subject: "Verify Email ✔",
      html: `<div>
    <div class="container">
     <div class="content">
         <p class="heading">Please click on button below to verify your email.</p>
         <a class=" verify-button" href="${process.env.FRONTEND_URL}/verify-email/${token}">Verify
             Email</a>
     </div>
     <div class="footer">
         <p>Thanks and Regards, epeak .</p>
         <p>For any queries contact us here:</p>
         <p>Phone: 98948465474323</p>     
 </div>
 </div>
   </div>`,
    });

    const hashedPassword = await generateHashedPassword(req.body.password);
    const createdUser = await createUser({ ...req.body, password: hashedPassword, verifyToken: token, isVerified: false });
    return res.status(201).json({
      status: "success",
      msg: "Register success",
      data: createdUser,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function loginUserHandler(req: Request<{}, {}, LoginUserInput["body"]>, res: Response, next: NextFunction) {
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // Generate a token with the user payload and secret key
  const accessToken = jwt.sign({ user }, `${process.env.AUTH_SECRET_KEY}`, { expiresIn: "1d" });

  res.status(200).json({
    msg: "Login success",
    success: true,
    accessToken: accessToken,
    user: user,
  });
}

export async function updateUserHandler(req: Request<UpdateUserInput["params"]>, res: Response, next: NextFunction) {
  try {
    const userId = req.params.userId;
    const update = req.body;

    const user = await findUser({ userId });
    if (!user) {
      next(new AppError("User does not exist", 404));
    }

    const updatedUser = await findAndUpdateUser({ userId }, update, {
      new: true,
    });

    return res.json({
      status: "success",
      msg: "Update success",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getUserHandler(req: Request<UpdateUserInput["params"]>, res: Response, next: NextFunction) {
  try {
    const userId = req.params.userId;
    const user = await findUser({ userId });

    if (!user) {
      next(new AppError("User does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: user,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getAllUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await findAllUser();
    return res.json({
      status: "success",
      msg: "Get all user success",
      data: users,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function deleteUserHandler(req: Request<UpdateUserInput["params"]>, res: Response, next: NextFunction) {
  try {
    const userId = req.params.userId;
    const user = await findUser({ userId });

    if (!user) {
      next(new AppError("User does not exist", 404));
    }

    await deleteUser({ userId });
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

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  // my custom header
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: true, message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(token, `${process.env.AUTH_SECRET_KEY}`);
    // Attach the decoded payload to the request for later use in the route handlers
    req.user = decoded;

    next();
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    return res.status(403).json({ error: true, message: "Invalid token" });
  }
};

export async function getUserFromTokenHandler(req: any, res: Response, next: NextFunction) {
  try {
    const decodedUser: any = req.user;
    return res.json({
      status: "success",
      msg: "Get user from token success",
      data: decodedUser,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function verifyEmailHander(req: any, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findOne({ verifyToken: req.params.token });

    if (!user) {
      next(new AppError("Token does not exist", 404));
    }

    const updated = await UserModel.findOneAndUpdate({ verifyToken: req.params.token }, { isVerified: true, verifyToken: "" }, { new: true });

    return res.json({
      status: "success",
      msg: "Verify success",
      data: updated,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}

export async function getUserByUsernameHandler(req: any, res: Response, next: NextFunction) {
  try {
    const username = req.params.username;
    const user = await findUser({ username });

    if (!user) {
      next(new AppError("User does not exist", 404));
    }

    return res.json({
      status: "success",
      msg: "Get success",
      data: user,
    });
  } catch (error: any) {
    console.error(colors.red("msg:", error.message));
    next(new AppError("Internal server error", 500));
  }
}
