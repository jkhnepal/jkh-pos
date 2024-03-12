import { date, number, object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    receiptNumber: string({
      required_error: "Receipt Number is required",
    }),
    paymentDate: date().optional(),

    party: string({
      required_error: "Party is required",
    }),

    paymentMethod: string({
      required_error: "Payment Method is required",
    }),

    receivedAmount: number({
      required_error: "Received amount is required",
    }),

    note: string().optional(),
    image: string().optional(),
  }),
};

const params = {
  params: object({
    paymentInId: string({
      required_error: "paymentInId is required",
    }),
  }),
};

// Define specific schemas
export const createPaymentInSchema = object({
  ...payload,
});

export const updatePaymentInSchema = object({
  ...payload,
  ...params,
});

export const deletePaymentInSchema = object({
  ...params,
});

export const getPaymentInSchema = object({
  ...params,
});

export const getAllPaymentInSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreatePaymentInInput = TypeOf<typeof createPaymentInSchema>;
export type UpdatePaymentInInput = TypeOf<typeof updatePaymentInSchema>;
export type ReadPaymentInInput = TypeOf<typeof getPaymentInSchema>;
export type DeletePaymentInInput = TypeOf<typeof deletePaymentInSchema>;
