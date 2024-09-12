import { object, string, number, array, TypeOf } from "zod";

// Define common schemas for transactions
const saleSchema = object({
  product: string({
    required_error: "Product ID is required",
  }),
  memberName: string().optional(),
  memberPhone: string().optional(),
  cp: number({
    required_error: "Cost price (cp) is required",
  }),
  sp: number({
    required_error: "Selling price (sp) is required",
  }),
  quantity: number({
    required_error: "Quantity is required",
  }),
  totalAmount: number({
    required_error: "Total amount is required",
  }),
  discountAmount: number({
    required_error: "Discount amount is required",
  }),
  totalDiscountAmount: number({
    required_error: "Total discount amount is required",
  }),
  returnedQuantity: number().optional(),
  invoiceNo: string({
    required_error: "Invoice number is required",
  }),

  // cashPaid: number().optional(),
  // onlinePaid: number().optional(),
  
});

const payload = {
  body: object({
    branch: string({
      required_error: "Branch ID is required",
    }),

    memberName: string().optional(),
    memberPhone: string().optional(),
    invoiceNo: string({
      required_error: "Invoice number is required",
    }),
    sales: array(saleSchema),
  }),
};

const params = {
  params: object({
    transactionId: string({
      required_error: "Transaction ID is required",
    }),
  }),
};

// Define specific schemas
export const createTransactionSchema = object({
  ...payload,
});

export const updateTransactionSchema = object({
  ...payload,
  ...params,
});

export const deleteTransactionSchema = object({
  ...params,
});

export const getTransactionSchema = object({
  ...params,
});

export const getAllTransactionSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateTransactionInput = TypeOf<typeof createTransactionSchema>;
export type UpdateTransactionInput = TypeOf<typeof updateTransactionSchema>;
export type ReadTransactionInput = TypeOf<typeof getTransactionSchema>;
export type DeleteTransactionInput = TypeOf<typeof deleteTransactionSchema>;
