import express from "express";
import { validate } from "../middleware/validateResource";
import { createPaymentInHandler, updatePaymentInHandler, getPaymentInHandler, getAllPaymentInHandler, deletePaymentInHandler } from "../controller/paymentIn.controller";
import { createPaymentInSchema, updatePaymentInSchema, getPaymentInSchema, getAllPaymentInSchema, deletePaymentInSchema } from "../schema/paymentIn.schema";


const router = express.Router();

router.post("/", [validate(createPaymentInSchema)], createPaymentInHandler);
router.patch("/:paymentInId", [validate(updatePaymentInSchema)], updatePaymentInHandler);
router.get("/:paymentInId", [validate(getPaymentInSchema)], getPaymentInHandler);
router.get("/", [validate(getAllPaymentInSchema)], getAllPaymentInHandler);
router.delete("/:paymentInId", [validate(deletePaymentInSchema)], deletePaymentInHandler);

export default router;
