// import express from "express";
// import { validate } from "../middleware/validateResource";
// import { createPointClaimHistoryHandler, getAllPointClaimHistoryHandler, getPointClaimHistoryHandler, updatePointClaimHistoryHandler, deletePointClaimHistoryHandler } from "../controller/pointClaimHistory.controller";
// import { createPointClaimHistorySchema, getAllPointClaimHistorySchema, getPointClaimHistorySchema, updatePointClaimHistorySchema, deletePointClaimHistorySchema } from "../schema/pointClaim.schema";

// const router = express.Router();

// router.post("/", [validate(createPointClaimHistorySchema)], createPointClaimHistoryHandler);
// router.get("/", [validate(getAllPointClaimHistorySchema)], getAllPointClaimHistoryHandler);
// router.get("/:pointClaimHistoryId", [validate(getPointClaimHistorySchema)], getPointClaimHistoryHandler);
// router.patch("/:pointClaimHistoryId", [validate(updatePointClaimHistorySchema)], updatePointClaimHistoryHandler);
// router.delete("/:pointClaimHistoryId", [validate(deletePointClaimHistorySchema)], deletePointClaimHistoryHandler);

// export default router;
