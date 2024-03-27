import { coerce, object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    branch: string({
      required_error: "branch is required",
    }),

    member: string({
      required_error: "member is required",
    }),

    sale: string({
      required_error: "sale is required",
    }),

    quantity: coerce.number().default(1),
  }),
};

const params = {
  params: object({
    returnId: string({
      required_error: "returnId is required",
    }),
  }),
};

// Define specific schemas
export const createReturnSchema = object({
  ...payload,
});

export const updateReturnSchema = object({
  ...payload,
  ...params,
});

export const deleteReturnSchema = object({
  ...params,
});

export const getReturnSchema = object({
  ...params,
});

export const getAllReturnSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateReturnInput = TypeOf<typeof createReturnSchema>;
export type UpdateReturnInput = TypeOf<typeof updateReturnSchema>;
export type ReadReturnInput = TypeOf<typeof getReturnSchema>;
export type DeleteReturnInput = TypeOf<typeof deleteReturnSchema>;
