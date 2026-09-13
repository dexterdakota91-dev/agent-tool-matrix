"use client";

import dynamic from "next/dynamic";
import { InitialData } from "@/app/actions";
import { RefreshCw } from "lucide-react";

const MatrixClient = dynamic(
  () => import("@/components/MatrixClient").then((mod) => mod.MatrixClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#07090e] text-white gap-3">
        <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
        <p className="text-xs font-mono opacity-70">Loading Agent Tool Matrix...</p>
      </div>
    ),
  }
);

export function MatrixClientWrapper({ initialData }: { initialData: InitialData }) {
  return <MatrixClient initialData={initialData} />;
}
