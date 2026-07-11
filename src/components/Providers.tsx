"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "@/lib/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <NeonAuthUIProvider authClient={authClient}>
        {children}
      </NeonAuthUIProvider>
    </ThemeProvider>
  );
}
