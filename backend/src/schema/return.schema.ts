import { array, coerce, object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    sale: string({
      required_error: "sale is required",
    }),

    returnedProducts: string({
      required_error: "product is required",
    }),

    takenProducts: string({
      required_error: "product is required",
    }),

    extraAddedAmount: coerce.number().optional().default(0),
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

// import { array, coerce, object, string, TypeOf, unknown } from "zod";

// // Define common schemas
// const payload = {
//   body: object({
//     branch: string({
//       required_error: "branch is required",
//     }),

//     product: string({
//       required_error: "product is required",
//     }),

//     member: string({
//       required_error: "member is required",
//     }),

//     sp: coerce.number({
//       required_error: "sp is required",
//     }),

//     quantity: coerce.number({
//       required_error: "quantity is required",
//     }),

//     discount: coerce.number({
//       required_error: "discount is required",
//     }),

//     totalAmount: coerce.number({
//       required_error: "totalAmount is required",
//     }),

//     newProduct: array(string()).optional(),
//     extraAddedAmount: coerce.number().optional(),
//   }),
// };

// const params = {
//   params: object({
//     returnId: string({
//       required_error: "returnId is required",
//     }),
//   }),
// };

// // Define specific schemas
// export const createReturnSchema = object({
//   ...payload,
// });

// export const updateReturnSchema = object({
//   ...payload,
//   ...params,
// });

// export const deleteReturnSchema = object({
//   ...params,
// });

// export const getReturnSchema = object({
//   ...params,
// });

// export const getAllReturnSchema = object({
//   query: object({}).optional(),
// });

// // Define types
// export type CreateReturnInput = TypeOf<typeof createReturnSchema>;
// export type UpdateReturnInput = TypeOf<typeof updateReturnSchema>;
// export type ReadReturnInput = TypeOf<typeof getReturnSchema>;
// export type DeleteReturnInput = TypeOf<typeof deleteReturnSchema>;
