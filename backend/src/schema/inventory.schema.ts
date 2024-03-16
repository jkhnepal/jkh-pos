import { coerce, object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    product: string({
      required_error: "product is required",
    }),

    stock: coerce.number({
      required_error: "stock price is required",
    }),
  }),
};

const updatePayload = {
  body: object({
    product: string({
      required_error: "product is required",
    }).optional(),

    stock: coerce.number({
      required_error: "stock price is required",
    }).optional()
  }),
};

const params = {
  params: object({
    inventoryId: string({
      required_error: "inventoryId is required",
    }),
  }),
};

// Define specific schemas
export const createInventorySchema = object({
  ...payload,
});

export const updateInventorySchema = object({
  ...updatePayload,
  ...params,
});

export const deleteInventorySchema = object({
  ...params,
});

export const getInventorySchema = object({
  ...params,
});

export const getAllInventorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateInventoryInput = TypeOf<typeof createInventorySchema>;
export type UpdateInventoryInput = TypeOf<typeof updateInventorySchema>;
export type ReadInventoryInput = TypeOf<typeof getInventorySchema>;
export type DeleteInventoryInput = TypeOf<typeof deleteInventorySchema>;
