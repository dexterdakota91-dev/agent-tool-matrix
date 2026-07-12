import { createAuthClient } from "@neondatabase/auth/react";

const authClient = createAuthClient("http://localhost");
console.log("Keys:", Object.keys(authClient));
console.log("Has useSession:", typeof authClient.useSession === "function");
