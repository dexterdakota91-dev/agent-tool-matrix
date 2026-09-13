import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react";

export const authClient = process.env.NEXT_PUBLIC_NEON_AUTH_URL
  ? createAuthClient(process.env.NEXT_PUBLIC_NEON_AUTH_URL, {
      adapter: BetterAuthReactAdapter(),
    })
  : null;

