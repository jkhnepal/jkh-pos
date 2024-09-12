import express from "express";
import { validate } from "../middleware/validateResource";
import { requireAdmin } from "../middleware/requireAdmin";
import { createTransactionHandler, updateTransactionHandler, getTransactionHandler, getAllTransactionHandler, deleteTransactionHandler, getTransactionsByBranchAndDateHandler } from "../controller/transaction.controller";
import { createTransactionSchema, updateTransactionSchema, getTransactionSchema, getAllTransactionSchema, deleteTransactionSchema } from "../schema/transaction.schema";
const router = express.Router();

// CREATE NEW TRANSACTION
router.post("/", [validate(createTransactionSchema)], createTransactionHandler);

// UPDATE TRANSACTION
router.patch("/:transactionId", [requireAdmin,validate(updateTransactionSchema)], updateTransactionHandler);

// GET TRANSACTION BY ID
router.get("/:transactionId", [validate(getTransactionSchema)], getTransactionHandler);

// GET ALL TRANSACTION
// router.get("/", [validate(getAllTransactionSchema)], getAllTransactionHandler);
router.get("/",  getAllTransactionHandler);

// DELETE TRANSACTION
router.delete("/:transactionId", [requireAdmin,validate(deleteTransactionSchema)], deleteTransactionHandler);

router.get("/get-transactions-by-branch-and-date/:branchId/:date", getTransactionsByBranchAndDateHandler);

export default router;
