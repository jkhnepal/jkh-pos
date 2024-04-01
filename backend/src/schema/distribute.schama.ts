import { boolean, coerce, object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    branch: string({
      required_error: "branch is required",
    }),

    product: string({
      required_error: "product is required",
    }),

    stock: coerce.number({
      required_error: "stock is required",
    }),

    isAcceptedByBranch: boolean().optional(),
  }),
};

// Define common schemas
const updatePayload = {
  body: object({
    branch: string().optional(),
    product: string().optional(),
    stock: coerce.number().optional(),
    isAcceptedByBranch: boolean().optional(),
  }),
};

const params = {
  params: object({
    distributeId: string({
      required_error: "distributeId is required",
    }),
  }),
};

// Define specific schemas
export const createDistributeSchema = object({
  ...payload,
});

export const updateDistributeSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteDistributeSchema = object({
  ...params,
});

export const getDistributeSchema = object({
  ...params,
});

export const getAllDistributeSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateDistributeInput = TypeOf<typeof createDistributeSchema>;
export type UpdateDistributeInput = TypeOf<typeof updateDistributeSchema>;
export type ReadDistributeInput = TypeOf<typeof getDistributeSchema>;
export type DeleteDistributeInput = TypeOf<typeof deleteDistributeSchema>;
