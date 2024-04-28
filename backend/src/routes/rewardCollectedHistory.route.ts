// import express from "express";
// import { validate } from "../middleware/validateResource";
// import { requireAdmin } from "../middleware/requireAdmin";
// import { createRewardCollectedHistoryHandler, getAllRewardCollectedHistoryHandler, getRewardCollectedHistoryHandler, updateRewardCollectedHistoryHandler, deleteRewardCollectedHistoryHandler } from "../controller/rewardCollectedHistory.controller";
// import { createRewardCollectedHistorySchema, getAllRewardCollectedHistorySchema, getRewardCollectedHistorySchema, updateRewardCollectedHistorySchema, deleteRewardCollectedHistorySchema } from "../schema/rewardCollectedHistory.schema";

// const router = express.Router();

// router.post("/", [requireAdmin, validate(createRewardCollectedHistorySchema)], createRewardCollectedHistoryHandler);
// router.get("/", getAllRewardCollectedHistoryHandler);
// router.get("/:rewardCollectedHistoryId", [validate(getRewardCollectedHistorySchema)], getRewardCollectedHistoryHandler);
// router.patch("/:rewardCollectedHistoryId", [requireAdmin, validate(updateRewardCollectedHistorySchema)], updateRewardCollectedHistoryHandler);
// router.delete("/:rewardCollectedHistoryId", [requireAdmin, validate(deleteRewardCollectedHistorySchema)], deleteRewardCollectedHistoryHandler);

// export default router;
