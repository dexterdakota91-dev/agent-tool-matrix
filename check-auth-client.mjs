import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react";

const authClient = createAuthClient("https://example.com/auth", {
  adapter: BetterAuthReactAdapter(),
});

console.log("authClient keys:", Object.keys(authClient || {}));
console.log("authClient useSession:", typeof authClient?.useSession);
console.log("authClient:", authClient);
