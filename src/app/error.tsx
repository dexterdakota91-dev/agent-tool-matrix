"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md w-full space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <h2 className="text-base font-bold">Something went wrong</h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-mono">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 mx-auto transition text-white cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}
