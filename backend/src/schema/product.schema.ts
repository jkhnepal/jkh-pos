import { boolean, coerce, object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    name: string({
      required_error: "name is required",
    }),

    // sku: string({
    //   required_error: "sku is required",
    // }),

    category: string({
      required_error: "category is required",
    }),

    cp: coerce.number({
      required_error: "cost price is required",
    }),

    sp: coerce.number({
      required_error: "selling price is required",
    }),

    image: string().optional(),
    note: string().optional(),

    totalAddedStock: coerce.number().default(0),
    availableStock: coerce.number().default(0),


    colors: string().optional(),
    sizes:string().optional(),

  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "productId is required",
    }),
  }),
};

// Define specific schemas
export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export const getProductSchema = object({
  ...params,
});

export const getAllProductSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type ReadProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
