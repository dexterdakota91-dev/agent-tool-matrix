"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowRight, Play, Check, Terminal } from "lucide-react";
import { Workflow } from "@/app/actions";

interface WorkflowsTabProps {
  workflows: Workflow[];
  handleDeleteWorkflow: (id: string) => Promise<void>;
  simulatingWorkflow: Workflow | null;
  setSimulatingWorkflow: (workflow: Workflow | null) => void;
  simStep: number;
  simLogs: string[];
  simStatus: "idle" | "running" | "success" | "failed";
  runSimulation: (workflow: Workflow) => Promise<void>;
}

export function WorkflowsTab({
  workflows,
  handleDeleteWorkflow,
  simulatingWorkflow,
  setSimulatingWorkflow,
  simStep,
  simLogs,
  simStatus,
  runSimulation
}: WorkflowsTabProps) {
  return (
    <motion.div
      key="workflows"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left h-full overflow-y-auto pr-2 scrollbar-thin"
    >
      {/* Left Panel: Workflow List */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Saved Workflows</h2>
          <p className="text-xs opacity-60">
            Select a workflow to load into the interactive simulation debugger.
          </p>
        </div>

        {workflows.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <h3 className="text-sm font-bold text-foreground">No Workflows Registered</h3>
            <p className="text-xs text-foreground/60 mt-1 max-w-xs mx-auto">
              Go to the Builder tab to design and register your first automated pipeline.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                onClick={() => setSimulatingWorkflow(wf)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left relative ${
                  simulatingWorkflow?.id === wf.id
                    ? "bg-blue-600/10 border-blue-500 shadow-md"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight pr-6">
                      {wf.title}
                    </h3>
                    <p className="text-[11px] opacity-70 line-clamp-2 mt-1 leading-relaxed">
                      {wf.description || "No description provided."}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkflow(wf.id);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 absolute right-3 top-3"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 w-full overflow-x-auto scrollbar-thin text-[10px] font-mono text-foreground/60 select-none">
                  {wf.tools?.map((tool, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <ArrowRight className="w-3 h-3 text-foreground/30 flex-shrink-0" />}
                      <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 truncate max-w-[100px] flex-shrink-0">
                        {tool.toolTitle}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simulator Visualizer */}
      <div className="lg:col-span-7 space-y-6 bg-zinc-950/60 border border-white/10 p-6 rounded-2xl min-h-[400px] flex flex-col justify-between">
        {!simulatingWorkflow ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-3 py-20">
            <Terminal className="w-12 h-12 opacity-30 text-blue-400" />
            <h3 className="text-sm font-bold text-foreground">Interactive Simulator</h3>
            <p className="text-[11px] text-foreground/60 max-w-xs">
              Select a pipeline from the left pane to view execution steps and run code tests.
            </p>
          </div>
        ) : (
          <>
            {/* Top Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Active Simulator
                </span>
                <h3 className="text-base font-bold text-foreground mt-1.5">{simulatingWorkflow.title}</h3>
              </div>

              <button
                onClick={() => runSimulation(simulatingWorkflow)}
                disabled={simStatus === "running"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs shadow active:scale-95 transition-all duration-200"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{simStatus === "running" ? "Running..." : "Simulate Run"}</span>
              </button>
            </div>

            {/* Middle: Sequence Map */}
            <div className="my-6 space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60">Pipeline Sequence Map</div>

              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start md:flex-nowrap gap-4 md:gap-2 w-full overflow-x-auto pb-3 scrollbar-thin select-none">
                {simulatingWorkflow.tools?.map((tool, idx) => {
                  const isCurrent = simStep === idx;
                  const isPast = simStep > idx;
                  const isActiveRun = simStatus === "running";

                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <div
                          className={`hidden md:block w-8 h-0.5 rounded flex-shrink-0 transition-all duration-300 ${
                            isPast ? "bg-emerald-500 shadow-md" : "bg-white/10"
                          }`}
                        />
                      )}

                      <div
                        className={`relative flex items-center gap-3 p-3 rounded-xl border w-full md:w-auto flex-shrink-0 transition-all duration-300 ${
                          isCurrent && isActiveRun
                            ? "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10 scale-105"
                            : isPast
                            ? "bg-emerald-500/10 border-emerald-500"
                            : "bg-white/5 border-white/5 opacity-55"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                            isCurrent && isActiveRun
                              ? "bg-blue-500 text-white animate-pulse"
                              : isPast
                              ? "bg-emerald-500 text-black"
                              : "bg-white/10"
                          }`}
                        >
                          {isPast ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold whitespace-nowrap">{tool.toolTitle}</div>
                          <span className="text-[8px] font-mono uppercase tracking-wider opacity-60">
                            {tool.toolType}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Console Terminal logs */}
            <div className="flex-grow flex flex-col justify-end bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-[11px] leading-relaxed min-h-[160px] max-h-[220px] overflow-y-auto">
              {simLogs.length === 0 ? (
                <div className="text-foreground/40 text-center py-10">
                  SYSTEM IDLE - PRESS &quot;SIMULATE RUN&quot; TO INITIALIZE PIPELINE RUNNER
                </div>
              ) : (
                <div className="space-y-1 text-left">
                  {simLogs.map((log, lIdx) => (
                    <div
                      key={lIdx}
                      className={`${
                        log.startsWith("✅") || log.includes("SUCCESS")
                          ? "text-emerald-400"
                          : log.startsWith("🚀") || log.startsWith("⚙️")
                          ? "text-blue-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
