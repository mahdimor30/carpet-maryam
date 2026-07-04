import { users } from "#/db";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const requestOtpServerFunction = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      email: z.email(),
    }),
  )
  .handler(async (ctx) => {
    const email = ctx.data.email;
    users.concat({
      email,
      otp: "1234",
    });

    return {
      ok: true,
    };
  });

