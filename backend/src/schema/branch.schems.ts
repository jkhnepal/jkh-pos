import { coerce, object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    name: string({
      required_error: "name is required",
    }),

    email: string({
      required_error: "email is required",
    }),

    phone: coerce.number({
      required_error: "phone is required",
    }),

    address: string({
      required_error: "address is required",
    }),

    image: string().optional(),

    type: string().default("branch"),
  }),
};

const params = {
  params: object({
    branchId: string({
      required_error: "branchId is required",
    }),
  }),
};

// Define specific schemas
export const createBranchSchema = object({
  ...payload,
});

export const updateBranchSchema = object({
  ...payload,
  ...params,
});

export const deleteBranchSchema = object({
  ...params,
});

export const getBranchSchema = object({
  ...params,
});

export const getAllBranchSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateBranchInput = TypeOf<typeof createBranchSchema>;
export type UpdateBranchInput = TypeOf<typeof updateBranchSchema>;
export type ReadBranchInput = TypeOf<typeof getBranchSchema>;
export type DeleteBranchInput = TypeOf<typeof deleteBranchSchema>;
