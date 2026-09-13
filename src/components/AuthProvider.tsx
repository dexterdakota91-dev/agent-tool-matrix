"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!authClient) {
    return <>{children}</>;
  }

  return (
    <NeonAuthUIProvider authClient={authClient}>
      {children}
    </NeonAuthUIProvider>
  );
}

