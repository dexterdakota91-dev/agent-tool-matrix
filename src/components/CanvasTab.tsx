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
      className="flex-grow flex flex-col gap-4 overflow-hidden h-full min-h-0"
    >
      {/* Search Bar - In document flow */}
      <SearchBar />

      {/* Empty State / Grid Container */}
      <AnimatePresence mode="popLayout" initial={false}>
        {filteredTools.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 w-full"
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
            layout="position"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTool(null);
            }}
            className="flex-grow flex gap-6 overflow-x-auto overflow-y-hidden pb-4 min-h-0 h-full w-full"
          >
            {/* LEFT 1/3: Selected Card fully expanded */}
            <motion.div
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="flex-shrink-0 flex flex-col justify-between items-center text-left h-full min-h-0 pb-1"
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
              layout
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedTool(null);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="flex-grow h-full min-h-0 overflow-x-auto overflow-y-hidden"
            >
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedTool(null);
                }}
                className="grid grid-flow-col grid-rows-3 gap-3 auto-cols-max h-full min-h-0"
              >
                {relevanceSortedTools.map(({ tool: t, score }) => (
                  <div key={t.id} className="w-[175px]">
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
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* ========== DEFAULT MODE: Dense horizontal-scrolling grid ========== */
          <motion.div
            key="default-mode"
            layout="position"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTool(null);
            }}
            className="flex-grow grid grid-flow-col grid-rows-3 gap-3 auto-cols-max overflow-x-auto overflow-y-hidden pb-4 min-h-0 w-full"
          >
            {filteredTools.map((tool, idx) => (
              <div key={tool.id} className="w-[175px]">
                <ToolCard
                  tool={tool}
                  delay={idx * 0.02}
                  onClick={() => {
                    setSelectedTool(tool);
                  }}
                  isDirectMatch={
                    searchQuery.trim() ? directMatchIds.has(tool.id) : undefined
                  }
                  isRelatedMatch={
                    searchQuery.trim() ? relatedMatchIds.has(tool.id) : undefined
                  }
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
