"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCanvasStore } from "@/store/useCanvasStore";
import { Edit, Trash2, Layers, X, Copy, Check, Download, Plug, ShoppingCart } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export type ToolType = "prompt" | "skill" | "mcp";

export interface ToolData {
  id: string;
  title: string;
  type: ToolType;
  description: string | null;
  tags: string[];
  markdownContent: string | null;
  createdAt: string;
  updatedAt: string;
}

const glowMap = {
  prompt: "rgba(236, 72, 153, 0.25)",
  skill: "rgba(59, 130, 246, 0.25)",
  mcp: "rgba(16, 185, 129, 0.25)"
};

const borderMap = {
  prompt: "border-pink-500/20 hover:border-pink-500/80 hover:bg-pink-500/5",
  skill: "border-blue-500/20 hover:border-blue-500/80 hover:bg-blue-500/5",
  mcp: "border-emerald-500/20 hover:border-emerald-500/80 hover:bg-emerald-500/5"
};

const activeBorderMap = {
  prompt: "border-pink-500",
  skill: "border-blue-500",
  mcp: "border-emerald-500"
};

const iconMap = {
  prompt: "💬",
  skill: "⚡",
  mcp: "🔌"
};

const labelMap = {
  prompt: "Prompt",
  skill: "Skill",
  mcp: "MCP"
};

const typeColorMap = {
  prompt: "from-pink-500/0 via-pink-500/70 to-pink-500/0",
  skill: "from-blue-500/0 via-blue-500/70 to-blue-500/0",
  mcp: "from-emerald-500/0 via-emerald-500/70 to-emerald-500/0"
};

interface ToolCardProps {
  tool: ToolData;
  delay?: number;
  onClick?: () => void;
  isSelected?: boolean;
  relevanceScore?: number; // 0-1, used in selection mode to rank proximity
  isInBuilder?: boolean;
  onAddToPipeline?: () => void;
  isDirectMatch?: boolean;
  isRelatedMatch?: boolean;
  userRole?: "Admin" | "Guest";
  onEdit?: () => void;
  onDelete?: () => void;
  isAddedToCart?: boolean;
  onAddToCart?: () => void;
  onRemoveFromCart?: () => void;
}

export function ToolCard({
  tool, delay = 0, onClick, isSelected = false,
  relevanceScore, isInBuilder = false, onAddToPipeline,
  isDirectMatch, isRelatedMatch, userRole = "Guest", onEdit, onDelete,
  isAddedToCart = false, onAddToCart, onRemoveFromCart
}: ToolCardProps) {
  const searchQuery = useCanvasStore((state) => state.searchQuery);
  const [isHovered, setIsHovered] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"description" | "implementation" | "schema">("description");
  const [copied, setCopied] = React.useState(false);

  // Determine visual state from search
  const hasSearch = searchQuery.trim().length > 0;

  // Hover only triggers expansion if card is not filtered out
  const isUnmatched = hasSearch && isDirectMatch === false && isRelatedMatch === false;
  const canHoverExpand = !isUnmatched;
  const isExpanded = isSelected ||
                     (isDirectMatch === true) ||
                     (canHoverExpand && isHovered) ||
                     (relevanceScore !== undefined && relevanceScore >= 0.7);

  // Dynamic sizing: matched cards grow, unmatched shrink and fade
  let cardScale = 1;
  let cardOpacity = 1;
  let cardFilter = "grayscale(0%) brightness(1)";

  // Card height class
  const heightClass = isExpanded ? "h-[120px]" : "h-[74px]";

  if (isSelected) {
    cardScale = 1;
    cardOpacity = 1;
    cardFilter = "grayscale(0%) brightness(1)";
  } else if (hasSearch) {
    if (isDirectMatch === true) {
      cardScale = 1.08;
      cardOpacity = 1;
      cardFilter = "grayscale(0%) brightness(1.05)";
    } else if (isRelatedMatch === true) {
      cardScale = 0.95;
      cardOpacity = 0.65;
      cardFilter = "grayscale(20%) brightness(0.9)";
    } else {
      // Unmatched
      cardScale = 0.75;
      cardOpacity = 0.15;
      cardFilter = "grayscale(100%) brightness(0.5)";
    }
  }

  // In selection mode (a card is selected, relevanceScore provided),
  // override opacity/scale based on how relevant this card is
  if (relevanceScore !== undefined && !isSelected) {
    cardOpacity = Math.max(0.15, relevanceScore);
    cardScale = 0.8 + relevanceScore * 0.2;
    if (relevanceScore < 0.3) {
      cardFilter = "grayscale(80%) brightness(0.6)";
    }
  }

  // Rise effect (y-translation) on hover/selected
  const liftY = isSelected ? 0 : (canHoverExpand && isHovered ? -6 : 0);

  // Dynamic shadow offsets based on floating height
  let shadowStyle = "";
  if (isSelected) {
    shadowStyle = `0 24px 38px -6px rgba(0,0,0,0.8), 0 12px 20px -6px ${glowMap[tool.type].replace('0.25', '0.6')}`;
  } else if (hasSearch) {
    if (isDirectMatch === true) {
      shadowStyle = `0 12px 24px -6px rgba(0,0,0,0.65), 0 4px 8px -4px ${glowMap[tool.type].replace('0.25', '0.15')}`;
    } else if (isRelatedMatch === true) {
      shadowStyle = `0 6px 12px -4px rgba(0,0,0,0.55)`;
    } else {
      shadowStyle = `0 2px 4px -2px rgba(0,0,0,0.35)`;
    }
  } else if (isHovered && canHoverExpand) {
    shadowStyle = `0 24px 38px -6px rgba(0, 0, 0, 0.8), 0 12px 20px -6px ${glowMap[tool.type].replace('0.25', '0.6')}`;
  } else {
    shadowStyle = `0 6px 14px -3px rgba(0,0,0,0.55), 0 2px 4px -2px rgba(0,0,0,0.45)`;
  }

  // Copy / Download / Connect handler
  const handleAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (tool.type === "prompt") {
      const promptText = tool.markdownContent || tool.description || "";
      navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (tool.type === "skill") {
      const codeText = tool.markdownContent || "";
      const filename = `${tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.js`;
      const blob = new Blob([codeText], { type: "text/javascript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (tool.type === "mcp") {
      const mcpSnippet = JSON.stringify({
        mcpServers: {
          [tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")]: {
            command: "npx",
            args: ["-y", tool.markdownContent || ""]
          }
        }
      }, null, 2);
      navigator.clipboard.writeText(mcpSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SELECTED VIEW (Fully Expanded Details Mode)
  if (isSelected) {
    return (
      <motion.div
        layout
        layoutId={`card-${tool.id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          layout: { type: "spring", stiffness: 30, damping: 12 },
          opacity: { duration: 0.6 }
        }}
        className={`
          relative flex flex-col justify-between
          rounded-xl p-4
          backdrop-blur-md bg-zinc-950/90 dark:bg-zinc-950/95
          border w-[320px] sm:w-[400px] h-[calc(100%-16px)] min-h-0
          ${activeBorderMap[tool.type]} border-2
        `}
        style={{
          boxShadow: shadowStyle
        }}
      >
        {/* Sci-Fi HUD Corner Brackets */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/30 rounded-tl-[4px] pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/30 rounded-tr-[4px] pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/30 rounded-bl-[4px] pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/30 rounded-br-[4px] pointer-events-none" />

        {/* Glowing accent border line on top */}
        <div className={`absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r ${typeColorMap[tool.type]} opacity-100 pointer-events-none`} />

        {/* Card Header (non-scrollable) */}
        <div className="flex-shrink-0 flex items-center justify-between pb-2 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{iconMap[tool.type]}</span>
            <span className="text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-foreground/80">
              {labelMap[tool.type]}
            </span>
          </div>
          {/* Close button inside card */}
          {onClick && (
            <button
              onClick={onClick}
              className="text-foreground/50 hover:text-foreground hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              title="Clear Selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Card Body */}
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1.5 space-y-3 text-left min-h-0">
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight leading-snug">
              {tool.title}
            </h3>
          </div>

          {/* Details Tabs UI Layout */}
          <div className="flex border-b border-white/10 mb-3 text-[9px] font-mono tracking-wider">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 pb-1.5 border-b-2 text-center transition-all ${
                activeTab === "description"
                  ? "border-blue-500 text-foreground font-semibold"
                  : "border-transparent text-foreground/40 hover:text-foreground/70"
              }`}
            >
              Description
            </button>
            {tool.markdownContent && (
              <button
                onClick={() => setActiveTab("implementation")}
                className={`flex-1 pb-1.5 border-b-2 text-center transition-all ${
                  activeTab === "implementation"
                    ? "border-blue-500 text-foreground font-semibold"
                    : "border-transparent text-foreground/40 hover:text-foreground/70"
                }`}
              >
                Code / Data
              </button>
            )}
            <button
              onClick={() => setActiveTab("schema")}
              className={`flex-1 pb-1.5 border-b-2 text-center transition-all ${
                activeTab === "schema"
                  ? "border-blue-500 text-foreground font-semibold"
                  : "border-transparent text-foreground/40 hover:text-foreground/70"
              }`}
            >
              Metadata
            </button>
          </div>

          {/* Tab Contents */}
          <div className="min-h-0 flex-grow">
            {activeTab === "description" && (
              <div className="space-y-3">
                <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line">
                  {tool.description || "No description provided."}
                </p>

                {/* Highly Prominent Action Button */}
                <button
                  onClick={handleAction}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-white ${
                    tool.type === 'prompt'
                      ? 'bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 shadow-pink-600/10'
                      : tool.type === 'skill'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-600/10'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-600/10'
                  }`}
                >
                  {tool.type === "prompt" ? (
                    <>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Prompt Copied!" : "Copy System Prompt"}</span>
                    </>
                  ) : tool.type === "skill" ? (
                    <>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                      <span>{copied ? "Skill File Saved!" : "Download Skill File"}</span>
                    </>
                  ) : (
                    <>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Plug className="w-3.5 h-3.5" />}
                      <span>{copied ? "MCP Config Copied!" : "Connect MCP Connector"}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "implementation" && tool.markdownContent && (
              <div className="space-y-1">
                <div className="bg-black/60 border border-white/5 rounded-lg p-2.5 text-[10px] font-mono overflow-x-auto text-emerald-400 max-h-[170px] scrollbar-thin">
                  <MarkdownRenderer content={tool.markdownContent} />
                </div>
              </div>
            )}

            {activeTab === "schema" && (
              <div className="space-y-3 text-xs font-mono text-foreground/80">
                <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="opacity-50">Type</div>
                  <div className="font-bold text-blue-400 uppercase">{tool.type}</div>

                  <div className="opacity-50">ID</div>
                  <div className="truncate text-[10px]" title={tool.id}>{tool.id}</div>
                </div>

                {tool.tags && tool.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] uppercase tracking-wider opacity-40">Associated Tags</div>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => useCanvasStore.getState().setSearchQuery(`#${tag}`)}
                          className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-zinc-300 cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel (Demoted pipeline button to secondary outline style) */}
        <div className="flex-shrink-0 flex items-center gap-2 pt-3 border-t border-white/10 mt-3">
          {onAddToPipeline && (
            <button
              onClick={onAddToPipeline}
              className="flex-grow flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-foreground/85 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>+ Add Step</span>
            </button>
          )}
          {onAddToCart && (
            <button
              onClick={isAddedToCart ? onRemoveFromCart : onAddToCart}
              className="flex-grow flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-foreground/85 font-semibold text-xs transition-all active:scale-95 cursor-pointer animate-fade-in"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-pink-500" />
              <span>{isAddedToCart ? "Remove Cart" : "Add to Cart"}</span>
            </button>
          )}
          {userRole === "Admin" && !isInBuilder && onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-foreground transition-all active:scale-95 cursor-pointer"
              title="Edit Tool"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {userRole === "Admin" && !isInBuilder && onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg border border-red-500/30 bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-all active:scale-95 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // DEFAULT VIEW
  return (
    <motion.div
      layout
      layoutId={`card-${tool.id}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: cardOpacity,
        scale: cardScale,
        filter: cardFilter,
        y: liftY
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        layout: { type: "spring", stiffness: 30, damping: 12 },
        opacity: { duration: 1.5, ease: "easeInOut", delay },
        scale: { type: "spring", stiffness: 50, damping: 14, delay },
        y: { type: "spring", stiffness: 50, damping: 14, delay },
        filter: { duration: 1.0, delay }
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative cursor-pointer select-none group
        rounded-xl p-3
        backdrop-blur-md bg-white/5 dark:bg-zinc-900/60
        border shadow-md
        flex flex-col justify-between
        w-full ${heightClass}
        ${borderMap[tool.type]}
      `}
      style={{
        boxShadow: shadowStyle
      }}
    >
      {/* Sci-Fi HUD Corner Brackets */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/20 rounded-tl-[3px] pointer-events-none group-hover:border-white/50 group-hover:scale-110 transition-all duration-300" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/20 rounded-tr-[3px] pointer-events-none group-hover:border-white/50 group-hover:scale-110 transition-all duration-300" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/20 rounded-bl-[3px] pointer-events-none group-hover:border-white/50 group-hover:scale-110 transition-all duration-300" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/20 rounded-br-[3px] pointer-events-none group-hover:border-white/50 group-hover:scale-110 transition-all duration-300" />

      {/* Glowing accent border line on top */}
      <div className={`absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r ${typeColorMap[tool.type]} opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      {/* Card contents wrapper */}
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Header row: icon + type badge */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm">{iconMap[tool.type]}</span>
            <span className="text-[8px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-foreground/70">
              {labelMap[tool.type]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[11px] font-bold text-foreground tracking-tight leading-[1.3] line-clamp-2 h-7 overflow-hidden">
            {tool.title}
          </h3>

        {/* Description — dynamically animated only when expanded */}
        <AnimatePresence initial={false}>
          {isExpanded && tool.description && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.6, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] text-foreground leading-snug mt-1 line-clamp-2 overflow-hidden"
            >
              {tool.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
  );
}
