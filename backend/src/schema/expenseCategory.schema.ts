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
    expenseCategoryId: string({
      required_error: "ExpenseCategoryId is required",
    }),
  }),
};

// Define specific schemas
export const createExpenseCategorySchema = object({
  ...payload,
});

export const updateExpenseCategorySchema = object({
  ...payload,
  ...params,
});

export const deleteExpenseCategorySchema = object({
  ...params,
});

export const getExpenseCategorySchema = object({
  ...params,
});

export const getAllExpenseCategorySchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateExpenseCategoryInput = TypeOf<typeof createExpenseCategorySchema>;
export type UpdateExpenseCategoryInput = TypeOf<typeof updateExpenseCategorySchema>;
export type ReadExpenseCategoryInput = TypeOf<typeof getExpenseCategorySchema>;
export type DeleteExpenseCategoryInput = TypeOf<typeof deleteExpenseCategorySchema>;
