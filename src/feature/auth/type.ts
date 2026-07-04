import { email, object, string } from "zod/v4-mini";

export const emailSchema = string().check(email("نشونی ایمیل درست نیست"));

export const formValidator = object({
  email: emailSchema,
});
