import * as React from "react";

export function SkeletonCard() {
  return (
    <div
      aria-busy="true"
      className="relative flex flex-col justify-between w-full h-[380px] p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse"
    >
      <div className="flex-shrink-0 flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/10" />
          <div className="w-12 h-4 rounded-full bg-white/10" />
        </div>
        <div className="w-7 h-7 rounded-lg bg-white/10" />
      </div>

      <div className="flex-grow space-y-4">
        <div className="w-3/4 h-5 rounded bg-white/10" />

        <div className="space-y-2">
          <div className="w-full h-3 rounded bg-white/10" />
          <div className="w-full h-3 rounded bg-white/10" />
          <div className="w-5/6 h-3 rounded bg-white/10" />
        </div>

        <div className="flex gap-2">
          <div className="w-12 h-4 rounded-full bg-white/10" />
          <div className="w-16 h-4 rounded-full bg-white/10" />
          <div className="w-14 h-4 rounded-full bg-white/10" />
        </div>

        <div className="w-full h-9 rounded-xl bg-white/10 mt-4" />
      </div>

      <div className="flex-shrink-0 flex gap-2 pt-3 border-t border-white/10 mt-3">
        <div className="flex-1 h-8 rounded-lg bg-white/10" />
        <div className="flex-1 h-8 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

export function SkeletonWorkflowRow() {
  return (
    <div
      aria-busy="true"
      className="p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse"
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="w-1/3 h-4 bg-white/10 rounded mb-2" />
          <div className="w-2/3 h-3 bg-white/10 rounded" />
        </div>
        <div className="w-7 h-7 rounded-lg bg-white/10 ml-4" />
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <div className="w-16 h-5 rounded bg-white/10" />
        <div className="w-3 h-3 rounded-full bg-white/10" />
        <div className="w-20 h-5 rounded bg-white/10" />
      </div>
    </div>
  );
}

export function SkeletonDetailPanel() {
  return (
    <div
      aria-busy="true"
      className="fixed top-0 right-0 h-full w-full max-w-md border-l border-white/10 shadow-2xl flex flex-col overflow-hidden bg-zinc-950 animate-pulse"
    >
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
        <div>
          <div className="w-16 h-5 rounded-full bg-white/10 mb-3" />
          <div className="w-48 h-8 rounded bg-white/10" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10" />
      </div>

      <div className="flex-1 p-6 space-y-8 bg-white/5">
        <div>
          <div className="w-24 h-4 rounded bg-white/10 mb-3" />
          <div className="space-y-2">
            <div className="w-full h-3 rounded bg-white/10" />
            <div className="w-full h-3 rounded bg-white/10" />
            <div className="w-3/4 h-3 rounded bg-white/10" />
          </div>
        </div>

        <div>
          <div className="w-16 h-4 rounded bg-white/10 mb-3" />
          <div className="flex gap-2">
            <div className="w-12 h-6 rounded bg-white/10" />
            <div className="w-16 h-6 rounded bg-white/10" />
            <div className="w-14 h-6 rounded bg-white/10" />
          </div>
        </div>

        <div>
          <div className="w-32 h-4 rounded bg-white/10 mb-3" />
          <div className="w-full h-32 rounded-xl bg-white/10" />
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="w-full h-12 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}
