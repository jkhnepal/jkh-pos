import { coerce, object, string, TypeOf } from "zod";

// Define common payload schema
const payload = {
  body: object({
    product: string({
      required_error: "product is required",
    }),

    stock: coerce.number({
      required_error: "stock  is required",
    }),
  }),
};

// Define update payload
const updatePayload = {
  body: object({
    product: string().optional(),
    stock: coerce.number().optional(),
  }),
};

const params = {
  params: object({
    headquarterInventoryId: string({
      required_error: "headquarterInventoryId is required",
    }),
  }),
};

// Define specific schemas
export const createHeadquarterInventorySchema = object({
  ...payload,
});

export const updateHeadquarterInventorySchema = object({
  ...updatePayload,
  ...params,
});

export const deleteHeadquarterInventorySchema = object({
  ...params,
});

export const getHeadquarterInventorySchema = object({
  ...params,
});

export const getAllHeadquarterInventorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateHeadquarterInventoryInput = TypeOf<typeof createHeadquarterInventorySchema>;
export type UpdateHeadquarterInventoryInput = TypeOf<typeof updateHeadquarterInventorySchema>;
export type ReadHeadquarterInventoryInput = TypeOf<typeof getHeadquarterInventorySchema>;
export type DeleteHeadquarterInventoryInput = TypeOf<typeof deleteHeadquarterInventorySchema>;
