import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import logger from "./utils/logger";
import cors from "cors";
import connectDB from "./utils/connectDB";
import userRouter from "../src/routes/user.route";
import categoryRoute from "../src/routes/category.route";
import branchRoute from "../src/routes/branch.route";
import productRoute from "../src/routes/product.route";
import inventoryRoute from "../src/routes/inventory.route";
import distributeRoute from "../src/routes/distribute.route";
import memberRoute from "../src/routes/member.route";
import saleRoute from "../src/routes/sale.route";
import authRoute from "../src/routes/auth.route";
import headquarterInventoryRoute from "../src/routes/headquarterInventory.route";
import branchInventoryRoute from "../src/routes/branchInventory.route";
import statRoute from "../src/routes/stat.route";
import returnRoute from "../src/routes/return.route";
import pointClaimRoute from "../src/routes/pointClaim.route";

import returnToHeadquarterRoute from "../src/routes/returnToHeadquarter.route";
import rewardCollectedHistoryRoute from "../src/routes/rewardCollectedHistory.route";
import MemberModel from "./models/member.model";
import BranchModel from "./models/branch.model";

const app = express();
// const port = process.env.PORT;
const port = 5010;

// Middleware
// Body Parser middleware
app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://jkh.webxnep.com", "https://pos-h8ki.vercel.app"],
    credentials: true,
  })
);

// https://test.epeakexpedition.com/

// Route
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/branches", branchRoute);
app.use("/api/products", productRoute);
app.use("/api/inventories", inventoryRoute);
app.use("/api/distributes", distributeRoute);
app.use("/api/members", memberRoute);
app.use("/api/sales", saleRoute);
app.use("/api/auth", authRoute);

app.use("/api/headquarter-inventories", headquarterInventoryRoute);
app.use("/api/branch-inventories", branchInventoryRoute);

app.use("/api/returns", returnRoute);

app.use("/api/stats", statRoute);
app.use("/api/point-claims", pointClaimRoute);
app.use("/api/return-to-headquarter", returnToHeadquarterRoute);
app.use("/api/reward-collected-histories", rewardCollectedHistoryRoute);

// Testing
app.get("/healthChecker", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    msg: "Welcome to JKH Server.",
  });
});

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    msg: err.msg,
  });
});

// Function to create admin if not present
async function createAdminIfNotPresent() {
  try {
    const headquarterExist = await BranchModel.exists({ role: "headquarter" });
    if (!headquarterExist) {
      await BranchModel.create({
       name: "Admin",
        email: "jackethouse002@gmail.com",
        phone:"98637474744",
        password:"2b$10$SxlJO6xXDU7YQDvi23WgNuQoTD5My3V28oUSIcG0bx64STdWHk/5O",
        tyoe: "headquarter",
      });
      logger.info("Admin user created successfully.");
    }
  } catch (error:any) {
    logger.error(`Error creating admin user: ${error.message}`);
  }
}



app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connectDB();
  await createAdminIfNotPresent(); // Check and create admin user
});
