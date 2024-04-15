import { coerce, object, string, TypeOf } from "zod";

// Define common payload schema
const payload = {
  body: object({
    branch: string({
      required_error: "branch is required",
    }),

    member: string({
      required_error: "member is required",
    }),

    collectedAmount: coerce.number({
      required_error: "collectedAmount  is required",
    }),
  }),
};

// Define update payload
const updatePayload = {
  body: object({
    branch: string().optional(),
    member: string().optional(),
    collectedAmount: coerce.number().optional(),
  }),
};

const params = {
  params: object({
    rewardCollectedHistoryId: string({
      required_error: "rewardCollectedHistoryId is required",
    }),
  }),
};

// Define specific schemas
export const createRewardCollectedHistorySchema = object({
  ...payload,
});

export const updateRewardCollectedHistorySchema = object({
  ...updatePayload,
  ...params,
});

export const deleteRewardCollectedHistorySchema = object({
  ...params,
});

export const getRewardCollectedHistorySchema = object({
  ...params,
});

export const getAllRewardCollectedHistorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateRewardCollectedHistoryInput = TypeOf<typeof createRewardCollectedHistorySchema>;
export type UpdateRewardCollectedHistoryInput = TypeOf<typeof updateRewardCollectedHistorySchema>;
export type ReadRewardCollectedHistoryInput = TypeOf<typeof getRewardCollectedHistorySchema>;
export type DeleteRewardCollectedHistoryInput = TypeOf<typeof deleteRewardCollectedHistorySchema>;
