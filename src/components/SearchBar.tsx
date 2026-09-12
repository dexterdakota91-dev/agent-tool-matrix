"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";

export function SearchBar() {
  const { searchQuery, setSearchQuery, selectedType, setSelectedType } = useCanvasStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [lastGlobalQuery, setLastGlobalQuery] = useState(searchQuery);

  // Sync external changes (e.g. tag clicks) to local state
  // We use the pattern of checking during render to avoid useEffect cascading renders
  if (searchQuery !== lastGlobalQuery) {
    setLocalQuery(searchQuery);
    setLastGlobalQuery(searchQuery);
  }

  // Debounce pushing local state to global store
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== localQuery) {
        setSearchQuery(localQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery, searchQuery]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 dark:bg-black/40 border border-white/10 min-w-0">
      {/* Integrated Type Tabs Segmented Control */}
      <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 w-full sm:w-auto flex-shrink-0 justify-between sm:justify-start gap-1">
        {(["all", "prompt", "skill", "mcp"] as const).map((type) => {
          const isActive = selectedType === type;
          let activeClasses = "bg-white text-zinc-950 shadow-md font-bold";
          if (isActive) {
            if (type === "prompt") activeClasses = "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 font-bold";
            else if (type === "skill") activeClasses = "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30 font-bold";
            else if (type === "mcp") activeClasses = "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 font-bold";
          }
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? activeClasses
                  : "hover:bg-white/10 text-zinc-300 hover:text-white"
              }`}
            >
              {type === "all" ? "All" : type === "prompt" ? "Prompts" : type === "skill" ? "Skills" : "MCPs"}
            </button>
          );
        })}
      </div>

      {/* Search Input Line */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/40 rounded-lg w-full min-w-0 transition-all">
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search Tools, Skills, Connectors, or by #tag"
          aria-label="Search query"
          className="bg-transparent border-none outline-none w-full text-xs placeholder:text-zinc-400 text-zinc-100 min-w-0"
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setSearchQuery("");
            }}
            aria-label="Clear search"
            className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
