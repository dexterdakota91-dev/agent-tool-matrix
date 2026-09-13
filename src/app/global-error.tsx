"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-red-400">Application Error</h2>
          <p className="text-xs text-zinc-400 font-mono">
            {error.message || "An unexpected server error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold transition cursor-pointer"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
