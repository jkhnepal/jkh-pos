import { array, boolean, coerce, object, string, TypeOf, unknown } from "zod";

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

    totalAmount: coerce.number({
      required_error: "totalAmount is required",
    }),

    discountAmount: coerce.number({
      required_error: "discountAmount is required",
    }),

    
    totalDiscountAmount: coerce.number({
      required_error: "totalDiscountAmount is required",
    }),

    // totalAmountAfterDiscount: coerce.number({
    //   required_error: "totalAmountAfterDiscount is required",
    // }),

    cp: coerce.number({
      required_error: "cp is required",
    }),

    sp: coerce.number({
      required_error: "sp is required",
    }),

    invoiceNo: string({
      required_error: "invoice number is required",
    }),
  }),
};

// Define common schemas
const createPayload = {
  body: array(
    object({
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

      cp: coerce.number({
        required_error: "cp is required",
      }),

      discountAmount: coerce.number({
        required_error: "discountAmount is required",
      }),

      offerDiscountAmount: coerce.number({
        required_error: "offerDiscountAmount is required",
      }),

      totalDiscountAmount: coerce.number({
        required_error: "totalDiscountAmount is required",
      }),
  

      // totalAmountAfterDiscount: coerce.number({
      //   required_error: "totalAmountAfterDiscount is required",
      // }),

      sp: coerce.number({
        required_error: "sp is required",
      }),
    })
  ),
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
  ...createPayload,
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
