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

import typeRoute from "../src/routes/type.route";
import unitRoute from "../src/routes/unit.route";

import incomeRoute from "../src/routes/income.route";
import expenseRoute from "../src/routes/expense.route";

import paymentInRoute from "../src/routes/paymentIn.route";
import paymentOutRoute from "../src/routes/paymentOut.route";

import incomeCategoryRoute from "../src/routes/incomeCategory.route";
import expenseCategoryRoute from "../src/routes/expenseCategory.route";

const app = express();
// const port = process.env.PORT;
const port = 5008;

// Middleware
// Body Parser middleware
app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// https://test.epeakexpedition.com/

// Route
app.use("/api/users", userRouter);
app.use("/api/types", typeRoute);
app.use("/api/units", unitRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/branches", branchRoute);
app.use("/api/products", productRoute);
app.use("/api/inventories", inventoryRoute);
app.use("/api/distributes", distributeRoute);
app.use("/api/members", memberRoute);

app.use("/api/income-categories", incomeCategoryRoute);
app.use("/api/expense-categories", expenseCategoryRoute);

app.use("/api/incomes", incomeRoute);
app.use("/api/expenses", expenseRoute);

app.use("/api/payments-in", paymentInRoute);
app.use("/api/payments-out", paymentOutRoute);

// Testing
app.get("/healthChecker", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    msg: "Welcome to epeak Server.",
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

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);
  await connectDB();
});
