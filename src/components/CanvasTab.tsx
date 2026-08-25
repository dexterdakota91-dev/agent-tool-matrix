"use client";

import * as React from "react";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ToolCard } from "./ToolCard";
import { Tool } from "@/app/actions";

interface CanvasTabProps {
  filteredTools: Tool[];
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool | null) => void;
  userRole: "Admin" | "Guest";
  handleOpenEdit: (tool: Tool) => void;
  handleDeleteTool: (id: string) => void;
  addToPipeline: (tool: Tool) => void;
  cart: Tool[];
  addToCart: (tool: Tool) => void;
  removeFromCart: (id: string) => void;
  searchQuery: string;
  directMatchIds: Set<string>;
  relatedMatchIds: Set<string>;
}

export function CanvasTab({
  filteredTools,
  selectedTool,
  setSelectedTool,
  userRole,
  handleOpenEdit,
  handleDeleteTool,
  addToPipeline,
  cart,
  addToCart,
  removeFromCart,
  searchQuery,
  directMatchIds,
  relatedMatchIds
}: CanvasTabProps) {
  const relevanceSortedTools = useMemo(() => {
    if (!selectedTool) return [];

    // ⚡ Bolt Optimization: Memoized expensive array mapping and sorting
    // to prevent O(N log N) recalculations on every render.

    // Sort remaining tools by relevance to selected tool
    const selectedTags = new Set(selectedTool.tags || []);
    const otherTools = filteredTools.filter((t) => t.id !== selectedTool.id);

    const scored = otherTools.map((t) => {
      let score = 0;
      // Same type = base relevance
      if (t.type === selectedTool.type) score += 0.3;
      // Shared tags
      const toolTags = t.tags || [];
      const sharedCount = toolTags.filter((tag) => selectedTags.has(tag)).length;
      if (selectedTags.size > 0 && toolTags.length > 0) {
        score += (sharedCount / Math.max(selectedTags.size, 1)) * 0.7;
      }
      return { tool: t, score: Math.min(score, 1) };
    });

    // Sort: highest relevance first (leftmost = closest to selected card)
    scored.sort((a, b) => b.score - a.score);

    return scored;
  }, [filteredTools, selectedTool]);

  return (
    <motion.div
      key="canvas"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="flex-grow flex flex-col gap-3 sm:gap-4 overflow-hidden h-full min-h-0 bg-zinc-950/30 dark:bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 sm:p-4 md:p-5 shadow-2xl relative"
    >
      {/* Unified Search & Header Section */}
      <div className="flex-shrink-0 relative z-10">
        <SearchBar />
      </div>

      {/* Empty State / Grid Container */}
      <AnimatePresence mode="popLayout" initial={false}>
        {filteredTools.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 w-full relative z-10"
          >
            <Info className="w-12 h-12 opacity-40 text-blue-400" />
            <h3 className="text-base font-bold text-foreground">No Tools Found</h3>
            <p className="text-xs text-foreground/60 max-w-xs">
              Try altering your search or filter pills, or create a custom tool.
            </p>
          </motion.div>
        ) : selectedTool ? (
          /* ========== SELECTION MODE: Left Detail Panel + Right Relevance Flow ========== */
          <motion.div
            key="selection-mode"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTool(null);
            }}
            className="flex-grow flex flex-col md:flex-row gap-4 md:gap-6 overflow-y-auto md:overflow-y-hidden md:overflow-x-auto pt-2 pb-6 px-1 sm:px-2 md:pt-6 md:pb-6 md:px-3 min-h-0 h-full w-full relative z-10 no-scrollbar items-center md:items-stretch"
          >
            {/* LEFT 1/3: Selected Card fully expanded */}
            <motion.div
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="flex-shrink-0 flex flex-col justify-between items-center text-left w-full max-w-[360px] sm:max-w-[400px] md:w-auto h-auto md:h-full min-h-0 pb-1 mx-auto md:mx-0"
            >
              {/* The fully expanded ToolCard */}
              <ToolCard
                tool={selectedTool}
                isSelected={true}
                userRole={userRole}
                onEdit={() => handleOpenEdit(selectedTool)}
                onDelete={() => handleDeleteTool(selectedTool.id)}
                onAddToPipeline={() => addToPipeline(selectedTool)}
                onClick={() => setSelectedTool(null)}
                isAddedToCart={cart.some((t) => t.id === selectedTool.id)}
                onAddToCart={() => addToCart(selectedTool)}
                onRemoveFromCart={() => removeFromCart(selectedTool.id)}
                hasSearch={searchQuery.trim().length > 0}
              />

              {/* Fixed Clear Selection button at bottom */}
              <button
                onClick={() => {
                  setSelectedTool(null);
                }}
                className="mt-3 flex items-center justify-center gap-1.5 px-4 py-2 w-full text-xs font-mono font-semibold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity bg-white/5 border border-white/10 rounded-lg shadow-md flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Clear Selection</span>
              </button>
            </motion.div>

            {/* RIGHT 2/3: Relevance-sorted cards (most relevant near the left) */}
            <motion.div
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedTool(null);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="flex-grow w-full md:w-auto h-auto md:h-full min-h-0 overflow-y-auto md:overflow-y-hidden md:overflow-x-auto pt-1 pb-2 no-scrollbar"
            >
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedTool(null);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-none md:grid-flow-col md:grid-rows-3 items-start gap-3 sm:gap-4 auto-rows-max md:auto-cols-max h-full min-h-0 pt-2.5 justify-items-center md:justify-items-start"
              >
                {relevanceSortedTools.map(({ tool: t, score }) => (
                  <div key={t.id} className="w-full max-w-[280px] sm:max-w-none md:w-[175px] shrink-0">
                    <ToolCard
                      tool={t}
                      onClick={() => {
                        setSelectedTool(t);
                      }}
                      relevanceScore={score > 0 ? score : 0.08}
                      isDirectMatch={
                        searchQuery.trim() ? directMatchIds.has(t.id) : undefined
                      }
                      isRelatedMatch={
                        searchQuery.trim() ? relatedMatchIds.has(t.id) : undefined
                      }
                      hasSearch={searchQuery.trim().length > 0}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* ========== DEFAULT MODE: Dense horizontal-scrolling grid on desktop, responsive centered grid on mobile ========== */
          <motion.div
            key="default-mode"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTool(null);
            }}
            className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-none md:grid-flow-col md:grid-rows-3 items-start gap-3 sm:gap-4 auto-rows-max md:auto-cols-max overflow-y-auto md:overflow-y-hidden md:overflow-x-auto pt-3 pb-8 px-1 sm:px-2 md:pt-6 md:pb-6 md:px-3 min-h-0 w-full relative z-10 justify-items-center md:justify-items-start no-scrollbar"
          >
            {filteredTools.map((tool, idx) => (
              <div key={tool.id} className="w-full max-w-[280px] sm:max-w-none md:w-[175px] shrink-0">
                <ToolCard
                  tool={tool}
                  delay={Math.min(idx * 0.005, 0.2)}
                  onClick={() => {
                    setSelectedTool(tool);
                  }}
                  isDirectMatch={
                    searchQuery.trim() ? directMatchIds.has(tool.id) : undefined
                  }
                  isRelatedMatch={
                    searchQuery.trim() ? relatedMatchIds.has(tool.id) : undefined
                  }
                  hasSearch={searchQuery.trim().length > 0}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
