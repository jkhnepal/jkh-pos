import { coerce, date, number, object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    incomeCategory: string({
      required_error: "Income Category is required",
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
    incomeId: string({
      required_error: "incomeId is required",
    }),
  }),
};

// Define specific schemas
export const createIncomeSchema = object({
  ...payload,
});

export const updateIncomeSchema = object({
  ...payload,
  ...params,
});

export const deleteIncomeSchema = object({
  ...params,
});

export const getIncomeSchema = object({
  ...params,
});

export const getAllIncomeSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateIncomeInput = TypeOf<typeof createIncomeSchema>;
export type UpdateIncomeInput = TypeOf<typeof updateIncomeSchema>;
export type ReadIncomeInput = TypeOf<typeof getIncomeSchema>;
export type DeleteIncomeInput = TypeOf<typeof deleteIncomeSchema>;
