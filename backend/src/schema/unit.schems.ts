import { object, string, TypeOf } from "zod";

// Define common schemas
const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    shortForm: string().optional(),
  }),
};

const params = {
  params: object({
    unitId: string({
      required_error: "Unit Id is required",
    }),
  }),
};

// Define specific schemas
export const createUnitSchema = object({
  ...payload,
});

export const updateUnitSchema = object({
  ...payload,
  ...params,
});

export const deleteUnitSchema = object({
  ...params,
});

export const getUnitSchema = object({
  ...params,
});

export const getAllUnitSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateUnitInput = TypeOf<typeof createUnitSchema>;
export type UpdateUnitInput = TypeOf<typeof updateUnitSchema>;
export type ReadUnitInput = TypeOf<typeof getUnitSchema>;
export type DeleteUnitInput = TypeOf<typeof deleteUnitSchema>;
