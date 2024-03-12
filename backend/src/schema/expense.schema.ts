import { coerce, date, number, object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    expenseCategory: string({
      required_error: "Expense  Category is required",
    }),

    amount: number({
      required_error: "Amount is required",
    }),

    paymentMethod: string({
      required_error: "Payment Method is required",
    }),

    date: coerce.date().optional(),
    note: string().optional(),
    image: string().optional(),
  }),
};

const params = {
  params: object({
    expenseId: string({
      required_error: "expenseId is required",
    }),
  }),
};

// Define specific schemas
export const createExpenseSchema = object({
  ...payload,
});

export const updateExpenseSchema = object({
  ...payload,
  ...params,
});

export const deleteExpenseSchema = object({
  ...params,
});

export const getExpenseSchema = object({
  ...params,
});

export const getAllExpenseSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateExpenseInput = TypeOf<typeof createExpenseSchema>;
export type UpdateExpenseInput = TypeOf<typeof updateExpenseSchema>;
export type ReadExpenseInput = TypeOf<typeof getExpenseSchema>;
export type DeleteExpenseInput = TypeOf<typeof deleteExpenseSchema>;
