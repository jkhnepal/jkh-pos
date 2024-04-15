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

    returnedQuantity: coerce.number({
      required_error: "returnedQuantity is required",
    }),

    branchInventoryId: string({
      required_error: "branchInventoryId is required",
    }),
  }),
};

// Define common schemas
const updatePayload = {
  body: object({
    branch: string().optional(),
    product: string().optional(),
    branchInventoryId: string().optional(),
    returnedQuantity: coerce.number().optional(),
  }),
};

const params = {
  params: object({
    returnToHeadquarterId: string({
      required_error: "returnToHeadquarterId is required",
    }),
  }),
};

// Define specific schemas
export const createReturnToHeadquarterSchema = object({
  ...payload,
});

export const updateReturnToHeadquarterSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteReturnToHeadquarterSchema = object({
  ...params,
});

export const getReturnToHeadquarterSchema = object({
  ...params,
});

export const getAllReturnToHeadquarterSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateReturnToHeadquarterInput = TypeOf<typeof createReturnToHeadquarterSchema>;
export type UpdateReturnToHeadquarterInput = TypeOf<typeof updateReturnToHeadquarterSchema>;
export type ReadReturnToHeadquarterInput = TypeOf<typeof getReturnToHeadquarterSchema>;
export type DeleteReturnToHeadquarterInput = TypeOf<typeof deleteReturnToHeadquarterSchema>;
