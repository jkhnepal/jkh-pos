import express, { NextFunction, Request, Response } from "express";
require("dotenv").config();
import logger from "./utils/logger";
import cors from "cors";
import connectDB from "./utils/connectDB";
import userRouter from "../src/routes/user.route";
import categoryRoute from "../src/routes/category.route";
import branchRoute from "../src/routes/branch.route";
import productRoute from "../src/routes/product.route";
import inventoryRoute from "../src/routes/inventory.route";
import distributeRoute from "../src/routes/distribute.route";
import saleRoute from "../src/routes/sale.route";
import authRoute from "../src/routes/auth.route";
import headquarterInventoryRoute from "../src/routes/headquarterInventory.route";
import branchInventoryRoute from "../src/routes/branchInventory.route";
import statRoute from "../src/routes/stat.route";
import returnRoute from "../src/routes/return.route";
import returnToHeadquarterRoute from "../src/routes/returnToHeadquarter.route";
import settingRoute from "../src/routes/setting.route";
import BranchModel from "./models/branch.model";
import SettingModel from "./models/setting.model";

const app = express();
// const port = process.env.PORT || 5000;
const port = 5010;

// Middleware
// Body Parser middleware
app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://jkh.webxnep.com", "https://pos-h8ki.vercel.app", "https://jackethouse.vercel.app"],
    credentials: true,
  })
);

// Route
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/branches", branchRoute);
app.use("/api/products", productRoute);
app.use("/api/inventories", inventoryRoute);
app.use("/api/distributes", distributeRoute);
app.use("/api/sales", saleRoute);
app.use("/api/auth", authRoute);
app.use("/api/headquarter-inventories", headquarterInventoryRoute);
app.use("/api/branch-inventories", branchInventoryRoute);
app.use("/api/returns", returnRoute);
app.use("/api/stats", statRoute);
app.use("/api/return-to-headquarter", returnToHeadquarterRoute);
app.use("/api/settings", settingRoute);

// Testing
app.get("/healthChecker", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    msg: "Welcome to JKH Server smtp check.",
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
        phone: "98637474744",
        password: "$2b$10$M7g9ZydiAb2WRJUq7wHb1.f5ixn4R8s2V5QpXo11u9tn7fh890Vb.",
        type: "headquarter",
        address: "kathmandu Nepal",
      });
      logger.info("Admin user created successfully.");
    }
  } catch (error: any) {
    logger.error(`Error creating admin user: ${error.message}`);
  }
}
// creating setting if even one setting is not present
async function createSettingIfNotPresent() {
  const settings = await SettingModel.find();
  if (settings.length === 0) {
    await SettingModel.create({
      billNo: 0,
    });
    logger.info("Setting created successfully.");
  }
}

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connectDB();
  await createAdminIfNotPresent();
  createSettingIfNotPresent();
});
