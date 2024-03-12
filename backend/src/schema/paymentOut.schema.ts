import { date, number, object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    paymentNumber: string({
      required_error: "Payment number is required",
    }),
    paymentDate: date().optional(),

    party: string({
      required_error: "Party is required",
    }),

    paymentMethod: string({
      required_error: "Payment Method is required",
    }),

    paidAmount: number({
      required_error: "Paid amount is required",
    }),

    note: string().optional(),
    image: string().optional(),
  }),
};

const params = {
  params: object({
    paymentOutId: string({
      required_error: "paymentOutId is required",
    }),
  }),
};

// Define specific schemas
export const createPaymentOutSchema = object({
  ...payload,
});

export const updatePaymentOutSchema = object({
  ...payload,
  ...params,
});

export const deletePaymentOutSchema = object({
  ...params,
});

export const getPaymentOutSchema = object({
  ...params,
});

export const getAllPaymentOutSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreatePaymentOutInput = TypeOf<typeof createPaymentOutSchema>;
export type UpdatePaymentOutInput = TypeOf<typeof updatePaymentOutSchema>;
export type ReadPaymentOutInput = TypeOf<typeof getPaymentOutSchema>;
export type DeletePaymentOutInput = TypeOf<typeof deletePaymentOutSchema>;
