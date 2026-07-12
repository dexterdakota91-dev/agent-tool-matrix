import { useState, useCallback } from "react";
import { Workflow } from "@/app/actions";

export function useWorkflowSimulation() {
  const [simulatingWorkflow, setSimulatingWorkflow] = useState<Workflow | null>(null);
  const [simStep, setSimStep] = useState(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "success" | "failed">("idle");

  const runSimulation = useCallback(async (workflow: Workflow) => {
    if (!workflow.tools || workflow.tools.length === 0) return;

    setSimulatingWorkflow(workflow);
    setSimStatus("running");
    setSimStep(0);
    setSimLogs(["[SYSTEM] Initializing Agent Tool Matrix runner...", `[SYSTEM] Loaded pipeline: "${workflow.title}"`]);

    const stepLogs = [
      [
        "⚙️ [RUNNER] Instantiating runner context...",
        "🔌 [MCP] Binding schemas to LLM interface...",
        "💬 [PROMPT] Injecting system directives...",
        "⚡ [SKILL] Processing input parameters...",
        "✅ [STEP 1] Completed execution successfully."
      ],
      [
        "⚙️ [RUNNER] Passing context from previous step...",
        "🗄️ [DATABASE] Establishing pool connection to Neon...",
        "📈 [SQL] Querying workspace state: SELECT * FROM public.workspace_configs;",
        "🔧 [MCP] Syncing schemas and functions...",
        "✅ [STEP 2] Completed database transaction successfully."
      ],
      [
        "⚙️ [RUNNER] Finalizing flow orchestration...",
        "🌿 [GIT] Auditing branch structure...",
        "📝 [LOGS] Resolving merge blocks: 3 conflicts resolved in utils.ts",
        "🚀 [DEPLOY] Pushing build manifest to deployment branch...",
        "✅ [STEP 3] Code pipeline push succeeded."
      ],
      [
        "⚙️ [RUNNER] Running task sequence...",
        "🧠 [LLM] Reasoning over current node parameters...",
        "💾 [I/O] Updating local state buffer...",
        "✅ [STEP] Node execution successful."
      ]
    ];

    for (let i = 0; i < workflow.tools.length; i++) {
      setSimStep(i);
      const tool = workflow.tools[i];
      setSimLogs(prev => [...prev, `\n🚀 [EXECUTION] Running Step ${i + 1}: ${tool.toolTitle || "Agent Tool"}`]);

      const logsForStep = stepLogs[i] || stepLogs[3];
      for (const log of logsForStep) {
        await new Promise(r => setTimeout(r, 600));
        setSimLogs(prev => [...prev, log]);
      }
    }

    await new Promise(r => setTimeout(r, 800));
    setSimStatus("success");
    setSimLogs(prev => [...prev, "\n🎉 [SYSTEM] PIPELINE EXECUTION COMPLETED WITH STATUS: SUCCESS (0)"]);
  }, []);

  return {
    simulatingWorkflow,
    setSimulatingWorkflow,
    simStep,
    setSimStep,
    simLogs,
    setSimLogs,
    simStatus,
    setSimStatus,
    runSimulation
  };
}
