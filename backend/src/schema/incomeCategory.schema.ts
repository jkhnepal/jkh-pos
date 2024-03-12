import { object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    name: string({
      required_error: "Category Name is required",
    }),
  }),
};

const params = {
  params: object({
    incomeCategoryId: string({
      required_error: "IncomeCategoryId is required",
    }),
  }),
};

// Define specific schemas
export const createIncomeCategorySchema = object({
  ...payload,
});

export const updateIncomeCategorySchema = object({
  ...payload,
  ...params,
});

export const deleteIncomeCategorySchema = object({
  ...params,
});

export const getIncomeCategorySchema = object({
  ...params,
});

export const getAllIncomeCategorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateIncomeCategoryInput = TypeOf<typeof createIncomeCategorySchema>;
export type UpdateIncomeCategoryInput = TypeOf<typeof updateIncomeCategorySchema>;
export type ReadIncomeCategoryInput = TypeOf<typeof getIncomeCategorySchema>;
export type DeleteIncomeCategoryInput = TypeOf<typeof deleteIncomeCategorySchema>;
