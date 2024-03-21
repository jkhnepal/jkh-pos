import { coerce, object, string, TypeOf, unknown } from "zod";

// Define common schemas
const payload = {
  body: object({
    name: string({
      required_error: "name is required",
    }),

    phone: string({
      required_error: "phone is required",
    }),

    creatorBranch: string({
      required_error: "creatorBranch is required",
    }),
  }),
};

const params = {
  params: object({
    memberId: string({
      required_error: "memberId is required",
    }),
  }),
};

// Define specific schemas
export const createMemberSchema = object({
  ...payload,
});

export const updateMemberSchema = object({
  ...payload,
  ...params,
});

export const deleteMemberSchema = object({
  ...params,
});

export const getMemberSchema = object({
  ...params,
});

export const getAllMemberSchema = object({
  query: object({}).optional(),
});

// Define types
export type CreateMemberInput = TypeOf<typeof createMemberSchema>;
export type UpdateMemberInput = TypeOf<typeof updateMemberSchema>;
export type ReadMemberInput = TypeOf<typeof getMemberSchema>;
export type DeleteMemberInput = TypeOf<typeof deleteMemberSchema>;
