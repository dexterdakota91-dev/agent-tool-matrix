"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Tool } from "@/app/actions";
import { ToolType } from "@/components/ToolCard";

interface ToolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTool: Tool | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formTitle: string;
  setFormTitle: (title: string) => void;
  formType: "prompt" | "skill" | "mcp";
  setFormType: (type: "prompt" | "skill" | "mcp") => void;
  formDescription: string;
  setFormDescription: (desc: string) => void;
  formMarkdown: string;
  setFormMarkdown: (markdown: string) => void;
  formTags: string;
  setFormTags: (tags: string) => void;
  formSaving: boolean;
}

export function ToolFormModal({
  isOpen,
  onClose,
  editingTool,
  onSubmit,
  formTitle,
  setFormTitle,
  formType,
  setFormType,
  formDescription,
  setFormDescription,
  formMarkdown,
  setFormMarkdown,
  formTags,
  setFormTags,
  formSaving
}: ToolFormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl bg-zinc-950 border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground text-left">
                {editingTool ? `Modify Tool Node: ${editingTool.title}` : "Register New Component Node"}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={onSubmit} className="p-6 space-y-4 text-left overflow-y-auto max-h-[460px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Node Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Code Linter"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-blue-500 transition-colors text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Node Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ToolType)}
                    className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-zinc-900 outline-none focus:border-blue-500 transition-colors text-white"
                  >
                    <option value="prompt">Prompt (💬)</option>
                    <option value="skill">Skill (⚡)</option>
                    <option value="mcp">MCP Server (🔌)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide a summary of the tool node functionality..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-blue-500 transition-colors resize-none text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Documentation Spec (Markdown)</label>
                <textarea
                  value={formMarkdown}
                  onChange={(e) => setFormMarkdown(e.target.value)}
                  placeholder="### Technical Spec&#10;Describe key inputs/outputs and code examples here..."
                  rows={4}
                  className="w-full font-mono text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-blue-500 transition-colors text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="git, helper, database, deployment"
                  className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-blue-500 transition-colors text-white"
                />
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving || !formTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold text-xs active:scale-95 disabled:opacity-50 transition-all duration-200"
                >
                  {formSaving ? "Registering..." : editingTool ? "Apply Changes" : "Register Node"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
