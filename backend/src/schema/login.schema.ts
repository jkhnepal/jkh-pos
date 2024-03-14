import { coerce, object, string, TypeOf } from "zod";

const loginPayload = {
  body: object({
    email_phone: string({
      required_error: "Either email / phone is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  }),
};

export const loginSchema = object({
  ...loginPayload,
});

export type LoginInput = TypeOf<typeof loginSchema>;
