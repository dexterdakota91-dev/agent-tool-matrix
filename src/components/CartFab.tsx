"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ShoppingCart } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";

export function CartFab() {
  const { cart } = useCanvasStore();

  const handleCompile = () => {
    if (cart.length === 0) return;

    // Concatenate markdown content
    let compiled = `# Compiled Agent Skills\n\n`;
    compiled += `*Generated on ${new Date().toLocaleString()}*\n\n---\n\n`;

    cart.forEach((tool, index) => {
      compiled += `## ${index + 1}. ${tool.title} [${tool.type.toUpperCase()}]\n\n`;
      compiled += `**Description:** ${tool.description}\n\n`;
      if (tool.markdownContent) {
        compiled += `### Implementation\n\n${tool.markdownContent}\n\n`;
      }
      compiled += `---\n\n`;
    });

    // Trigger browser download
    const blob = new Blob([compiled], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compiled_agent_skills.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-8 right-8 z-[90]"
        >
          <button
            onClick={handleCompile}
            className="relative flex items-center gap-3 px-6 py-4 rounded-full bg-white text-black shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
          >
            {/* Badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              {cart.length}
            </div>

            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold tracking-tight">Compile Cart</span>
            <Download className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
