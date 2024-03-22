import { coerce, object, string, TypeOf } from "zod";

// Define common payload schema
const payload = {
  body: object({
    branch: string({
      required_error: "branch is required",
    }),

    product: string({
      required_error: "product is required",
    }),

    totalStock: coerce.number({
      required_error: "totalStock  is required",
    }),
  }),
};

// Define update payload
const updatePayload = {
  body: object({
    branch: string().optional(),
    product: string().optional(),
    totalStock: coerce.number().optional(),
  }),
};

const params = {
  params: object({
    branchInventoryId: string({
      required_error: "branchInventoryId is required",
    }),
  }),
};

// Define specific schemas
export const createBranchInventorySchema = object({
  ...payload,
});

export const updateBranchInventorySchema = object({
  ...updatePayload,
  ...params,
});

export const deleteBranchInventorySchema = object({
  ...params,
});

export const getBranchInventorySchema = object({
  ...params,
});

export const getAllBranchInventorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateBranchInventoryInput = TypeOf<typeof createBranchInventorySchema>;
export type UpdateBranchInventoryInput = TypeOf<typeof updateBranchInventorySchema>;
export type ReadBranchInventoryInput = TypeOf<typeof getBranchInventorySchema>;
export type DeleteBranchInventoryInput = TypeOf<typeof deleteBranchInventorySchema>;
