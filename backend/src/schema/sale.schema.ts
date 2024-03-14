import { coerce, object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    branch: string({
      required_error: "branch is required",
    }),

    product: string({
      required_error: "product is required",
    }),

    member: string({
      required_error: "member is required",
    }),

    quantity: coerce.number({
      required_error: "quantity is required",
    }),

    discount: coerce.number({
      required_error: "discount is required",
    }),

    sp: coerce.number({
      required_error: "sp is required",
    }),

    note: string().optional(),
  }),
};

const params = {
  params: object({
    saleId: string({
      required_error: "saleId is required",
    }),
  }),
};

// Define specific schemas
export const createSaleSchema = object({
  ...payload,
});

export const updateSaleSchema = object({
  ...payload,
  ...params,
});

export const deleteSaleSchema = object({
  ...params,
});

export const getSaleSchema = object({
  ...params,
});

export const getAllSaleSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateSaleInput = TypeOf<typeof createSaleSchema>;
export type UpdateSaleInput = TypeOf<typeof updateSaleSchema>;
export type ReadSaleInput = TypeOf<typeof getSaleSchema>;
export type DeleteSaleInput = TypeOf<typeof deleteSaleSchema>;
