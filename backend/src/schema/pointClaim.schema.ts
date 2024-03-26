import { coerce, object, string, TypeOf } from "zod";

// Define common payload schema
const payload = {
  body: object({
    member: string({
      required_error: "member is required",
    }),

    branch: string({
      required_error: "branch is required",
    }),

    claimPoint: coerce.number({
      required_error: "claimPoint  is required",
    }),

    claimAmount: coerce.number({
      required_error: "claimAmount  is required",
    }),
  }),
};

const params = {
  params: object({
    pointClaimHistoryId: string({
      required_error: "pointClaimHistoryId is required",
    }),
  }),
};

// Define specific schemas
export const createPointClaimHistorySchema = object({
  ...payload,
});

export const updatePointClaimHistorySchema = object({
  ...payload,
  ...params,
});

export const deletePointClaimHistorySchema = object({
  ...params,
});

export const getPointClaimHistorySchema = object({
  ...params,
});

export const getAllPointClaimHistorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreatePointClaimHistoryInput = TypeOf<typeof createPointClaimHistorySchema>;
export type UpdatePointClaimHistoryInput = TypeOf<typeof updatePointClaimHistorySchema>;
export type ReadPointClaimHistoryInput = TypeOf<typeof getPointClaimHistorySchema>;
export type DeletePointClaimHistoryInput = TypeOf<typeof deletePointClaimHistorySchema>;
