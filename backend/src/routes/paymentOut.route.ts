import express from "express";
import { validate } from "../middleware/validateResource";
import { createPaymentOutHandler, updatePaymentOutHandler, getPaymentOutHandler, getAllPaymentOutHandler, deletePaymentOutHandler } from "../controller/paymentOut.controller";
import { createPaymentOutSchema, updatePaymentOutSchema, getPaymentOutSchema, getAllPaymentOutSchema, deletePaymentOutSchema } from "../schema/paymentOut.schema";

const router = express.Router();

router.post("/", [validate(createPaymentOutSchema)], createPaymentOutHandler);
router.patch("/:paymentOutId", [validate(updatePaymentOutSchema)], updatePaymentOutHandler);
router.get("/:paymentOutId", [validate(getPaymentOutSchema)], getPaymentOutHandler);
router.get("/", [validate(getAllPaymentOutSchema)], getAllPaymentOutHandler);
router.delete("/:paymentOutId", [validate(deletePaymentOutSchema)], deletePaymentOutHandler);

export default router;
