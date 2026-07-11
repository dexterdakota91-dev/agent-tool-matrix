"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Check } from "lucide-react";
import { ToolData } from "@/components/ToolCard";
import { useCanvasStore } from "@/store/useCanvasStore";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface InspectorProps {
  tool: ToolData | null;
  onClose: () => void;
}

export function SlideOutInspector({ tool, onClose }: InspectorProps) {
  const { cart, addToCart, removeFromCart } = useCanvasStore();
  const inCart = tool ? cart.some(t => t.id === tool.id) : false;

  return (
    <AnimatePresence>
      {tool && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl z-[110] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider opacity-70 bg-white/10 px-2 py-1 rounded-full text-white">
                  {tool.type}
                </span>
                <h2 className="text-2xl font-bold text-white mt-3">{tool.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-white/90 leading-relaxed text-sm">
                  {tool.description}
                </p>
              </div>

              {tool.tags && tool.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tool.markdownContent && (
                <div>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">Implementation</h3>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-sm">
                    <MarkdownRenderer content={tool.markdownContent} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Action */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <button
                onClick={() => inCart ? removeFromCart(tool.id) : addToCart(tool)}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95 ${
                  inCart 
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                    : "bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white shadow-lg shadow-blue-500/20"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
