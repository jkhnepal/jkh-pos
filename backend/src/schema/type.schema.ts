import { object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    image: string().optional(),
    description: string().optional(),
  }),
};

const params = {
  params: object({
    typeId: string({
      required_error: "typeId is required",
    }),
  }),
};

// Define specific schemas
export const createTypeSchema = object({
  ...payload,
});

export const updateTypeSchema = object({
  ...payload,
  ...params,
});

export const deleteTypeSchema = object({
  ...params,
});

export const getTypeSchema = object({
  ...params,
});

export const getAllTypeSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateTypeInput = TypeOf<typeof createTypeSchema>;
export type UpdateTypeInput = TypeOf<typeof updateTypeSchema>;
export type ReadTypeInput = TypeOf<typeof getTypeSchema>;
export type DeleteTypeInput = TypeOf<typeof deleteTypeSchema>;
