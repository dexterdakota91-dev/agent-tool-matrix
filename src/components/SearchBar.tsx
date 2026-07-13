"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";

export function SearchBar() {
  const { searchQuery, setSearchQuery, selectedType, setSelectedType } = useCanvasStore();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2 px-2.5 py-2.5 rounded-2xl bg-white/5 dark:bg-black/35 backdrop-blur-md border border-white/10 shadow-lg z-50 relative">
      {/* Top Line: Integrated Type Tabs Segmented Control */}
      <div className="flex bg-white/5 dark:bg-black/20 p-0.5 rounded-xl border border-white/5 w-full">
        {(["all", "prompt", "skill", "mcp"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 ${
              selectedType === type
                ? "bg-white text-black shadow-sm font-bold"
                : "hover:bg-white/5 text-foreground/70 hover:text-foreground"
            }`}
          >
            {type === "all" ? "All" : type === "prompt" ? "Prompts" : type === "skill" ? "Skills" : "MCPs"}
          </button>
        ))}
      </div>

      {/* Bottom Line: Search Input Line */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 dark:bg-black/10 border border-white/5 rounded-xl min-w-0">
        <Search className="w-4 h-4 opacity-50 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Tools, Skills, Connectors, or by #tag"
          aria-label="Search query"
          className="bg-transparent border-none outline-none w-full text-xs placeholder:text-foreground/40 text-foreground min-w-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/50 hover:text-foreground transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
