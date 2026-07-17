"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, ChevronUp, ChevronDown, Trash2, CheckCircle2, RefreshCw } from "lucide-react";
import { Tool } from "@/app/actions";

interface BuilderTabProps {
  tools: Tool[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  builderSteps: Tool[];
  setBuilderSteps: (steps: Tool[]) => void;
  workflowTitle: string;
  setWorkflowTitle: (title: string) => void;
  workflowDescription: string;
  setWorkflowDescription: (desc: string) => void;
  isSavingWorkflow: boolean;
  handleSaveWorkflow: (e: React.FormEvent) => Promise<void>;
  moveStep: (index: number, direction: "up" | "down") => void;
  removeFromPipeline: (index: number) => void;
  addToPipeline: (tool: Tool) => void;
}

export function BuilderTab({
  tools,
  searchQuery,
  setSearchQuery,
  builderSteps,
  setBuilderSteps,
  workflowTitle,
  setWorkflowTitle,
  workflowDescription,
  setWorkflowDescription,
  isSavingWorkflow,
  handleSaveWorkflow,
  moveStep,
  removeFromPipeline,
  addToPipeline
}: BuilderTabProps) {
  return (
    <motion.div
      key="builder"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left h-full overflow-y-auto pr-2 scrollbar-thin"
    >
      {/* Left Panel: Available tools */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Select Component Nodes</h2>
          <p className="text-xs opacity-60">Click &quot;Add Step&quot; on any tool card to queue it as a step.</p>
        </div>

        <div className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
          <Search className="w-4 h-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter node list..."
            className="bg-transparent border-none outline-none w-full text-xs placeholder:text-foreground/50 text-foreground"
          />
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {tools
            .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {tool.type === "prompt" ? "💬" : tool.type === "skill" ? "⚡" : "🔌"}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold">{tool.title}</h4>
                    <p className="text-[11px] opacity-70 line-clamp-1">{tool.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToPipeline(tool)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-foreground hover:text-background font-semibold active:scale-95 transition-all duration-200"
                >
                  Add Step
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Right Panel: Current Pipeline Steps */}
      <div className="lg:col-span-7 space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Active Pipeline Sequence</h2>
            <p className="text-xs opacity-60">Sequence execution operates top-to-bottom.</p>
          </div>
          {builderSteps.length > 0 && (
            <button
              onClick={() => setBuilderSteps([])}
              className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded hover:bg-red-500/10 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {builderSteps.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-foreground/40 font-bold text-lg">
              0
            </div>
            <h3 className="text-sm font-bold text-foreground">Pipeline Queue Empty</h3>
            <p className="text-[11px] text-foreground/60 max-w-xs">
              Add tools from the left pane to initialize a custom agent workflow.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSaveWorkflow} className="space-y-6">
            <div className="space-y-4">
              {builderSteps.map((step, idx) => (
                <div key={`${step.id}-${idx}`} className="relative">
                  {/* Sequence Flow Connector Arrow */}
                  {idx > 0 && (
                    <div className="absolute -top-4 left-6 h-4 w-0.5 bg-gradient-to-b from-blue-500/50 to-emerald-500/50" />
                  )}

                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/60 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-xl">
                        {step.type === "prompt" ? "💬" : step.type === "skill" ? "⚡" : "🔌"}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold">{step.title}</h4>
                        <span className="text-[9px] uppercase tracking-wider opacity-60 font-mono">
                          {step.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Order adjustments */}
                      <button
                        type="button"
                        onClick={() => moveStep(idx, "up")}
                        disabled={idx === 0}
                        aria-label="Move step up"
                        title="Move step up"
                        className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-foreground/80 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(idx, "down")}
                        disabled={idx === builderSteps.length - 1}
                        aria-label="Move step down"
                        title="Move step down"
                        className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-foreground/80 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      {/* Remove step */}
                      <button
                        type="button"
                        onClick={() => removeFromPipeline(idx)}
                        aria-label="Remove step"
                        title="Remove step"
                        className="p-1.5 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 ml-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save workflow info */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <h3 className="text-sm font-semibold">Workflow Metadata</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Pipeline Title</label>
                  <input
                    type="text"
                    value={workflowTitle}
                    onChange={(e) => setWorkflowTitle(e.target.value)}
                    placeholder="e.g. Design-to-Deploy Code pipeline"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-blue-500 transition-colors text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider opacity-75">Workflow Description</label>
                  <input
                    type="text"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    placeholder="Describe output goals of this pipeline..."
                    className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-blue-500 transition-colors text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingWorkflow || !workflowTitle.trim() || builderSteps.length === 0}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold text-sm shadow active:scale-95 disabled:opacity-50 transition-all duration-200"
              >
                {isSavingWorkflow ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Pipeline...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Assemble & Register Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
