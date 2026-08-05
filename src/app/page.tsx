"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Plus,
  Compass,
  Layers,
  GitBranch,
  Settings,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CartFab } from "@/components/CartFab";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useWorkflowSimulation } from "@/hooks/useWorkflowSimulation";
import {
  createTool,
  updateTool,
  deleteTool,
  createWorkflow,
  deleteWorkflow,
  createApiKey,
  revokeApiKey,
  getInitialData,
  Tool,
  Workflow,
  ApiKey as DbApiKey
} from "@/app/actions";
import { ToolType } from "@/components/ToolCard";

import { CanvasTab } from "@/components/CanvasTab";
import { BuilderTab } from "@/components/BuilderTab";
import { WorkflowsTab } from "@/components/WorkflowsTab";
import { SettingsTab } from "@/components/SettingsTab";
import { ToolFormModal } from "@/components/ToolFormModal";

export default function AgentToolMatrix() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"canvas" | "builder" | "workflows" | "settings">("canvas");

  // Database State
  const [tools, setTools] = useState<Tool[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const { searchQuery, setSearchQuery, selectedType, cart, addToCart, removeFromCart } = useCanvasStore();

  // Selected/Detail State
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Create / Edit Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<ToolType>("prompt");
  const [formDescription, setFormDescription] = useState("");
  const [formMarkdown, setFormMarkdown] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  // Pipeline Builder State
  const [builderSteps, setBuilderSteps] = useState<Tool[]>([]);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);

  // Simulation State isolated in custom hook
  const {
    simulatingWorkflow,
    setSimulatingWorkflow,
    simStep,
    simLogs,
    simStatus,
    setSimStatus,
    runSimulation
  } = useWorkflowSimulation();

  // Settings Auth & API Keys State
  const [userRole, setUserRole] = useState<"Admin" | "Guest">("Admin");
  const [apiKeys, setApiKeys] = useState<DbApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getInitialData();
      setTools(data.tools);
      setWorkflows(data.workflows);
      setApiKeys(data.apiKeys);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from Neon database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) fetchData();
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  // Semantic search matching state: direct matches and first-hop related matches
  const { directMatchIds, relatedMatchIds } = useMemo(() => {
    const direct = new Set<string>();
    const related = new Set<string>();
    const query = searchQuery.trim().toLowerCase();

    if (!query) return { directMatchIds: direct, relatedMatchIds: related };

    const isTagSearch = query.startsWith("#");
    const cleanQuery = isTagSearch ? query.substring(1).trim() : query;

    // Direct matches by search query (only within tools of matching selectedType if selectedType !== 'all')
    tools.forEach((tool) => {
      if (selectedType !== "all" && tool.type !== selectedType) return;

      let isDirect = false;
      if (isTagSearch) {
        isDirect = tool.tags && tool.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      } else {
        isDirect =
          tool.title.toLowerCase().includes(cleanQuery) ||
          (tool.description && tool.description.toLowerCase().includes(cleanQuery)) ||
          (tool.tags && tool.tags.some((t) => t.toLowerCase().includes(cleanQuery))) ||
          tool.type.includes(cleanQuery);
      }
      if (isDirect) direct.add(tool.id);
    });

    if (direct.size > 0) {
      // Gather tags from direct matches
      const directTags = new Set<string>();
      tools.forEach((tool) => {
        if (direct.has(tool.id) && tool.tags) {
          tool.tags.forEach((t) => directTags.add(t.toLowerCase()));
        }
      });

      // Find related matches (must also match type filter if selectedType !== 'all')
      tools.forEach((tool) => {
        if (selectedType !== "all" && tool.type !== selectedType) return;
        if (!direct.has(tool.id) && tool.tags) {
          const sharesTag = tool.tags.some((t) => directTags.has(t.toLowerCase()));
          if (sharesTag) {
            related.add(tool.id);
          }
        }
      });
    }

    return { directMatchIds: direct, relatedMatchIds: related };
  }, [tools, searchQuery, selectedType]);

  const filteredTools = useMemo(() => {
    // If no search query, simply filter by type
    if (!searchQuery.trim()) {
      return tools.filter((tool) => selectedType === "all" || tool.type === selectedType);
    }

    // Direct matches first, then related matches in order of tag overlaps
    const directMatches = tools.filter((t) => directMatchIds.has(t.id));
    const relatedMatches = tools.filter((t) => relatedMatchIds.has(t.id));

    // Sort related matches by overlap count
    const directTags = new Set<string>();
    directMatches.forEach((t) => t.tags.forEach((tag) => directTags.add(tag.toLowerCase())));

    const scoredRelated = relatedMatches.map((t) => {
      const overlapCount = t.tags.filter((tag) => directTags.has(tag.toLowerCase())).length;
      return { tool: t, score: overlapCount };
    });
    scoredRelated.sort((a, b) => b.score - a.score);

    return [...directMatches, ...scoredRelated.map((r) => r.tool)];
  }, [tools, searchQuery, selectedType, directMatchIds, relatedMatchIds]);

  // Open creation form
  const handleOpenCreate = () => {
    setEditingTool(null);
    setFormTitle("");
    setFormType("prompt");
    setFormDescription("");
    setFormMarkdown("");
    setFormTags("");
    setIsFormOpen(true);
  };

  // Open edit form
  const handleOpenEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormTitle(tool.title);
    setFormType(tool.type);
    setFormDescription(tool.description || "");
    setFormMarkdown(tool.markdownContent || "");
    setFormTags(tool.tags.join(", "));
    setIsFormOpen(true);
    setSelectedTool(null); // close detail view
  };

  // Handle Create / Edit Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setFormSaving(true);
    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formTitle,
      type: formType,
      description: formDescription,
      markdownContent: formMarkdown,
      tags: tagsArray
    };

    try {
      if (editingTool) {
        await updateTool(editingTool.id, payload);
      } else {
        await createTool(payload);
      }
      setIsFormOpen(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save tool.");
    } finally {
      setFormSaving(false);
    }
  };

  // Handle Delete Tool
  const handleDeleteTool = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool? All workflow connections will be removed.")) return;
    try {
      await deleteTool(id);
      setSelectedTool(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete tool.");
    }
  };

  // Add to builder pipeline
  const addToPipeline = (tool: Tool) => {
    setBuilderSteps([...builderSteps, tool]);
  };

  // Remove from pipeline
  const removeFromPipeline = (index: number) => {
    const updated = [...builderSteps];
    updated.splice(index, 1);
    setBuilderSteps(updated);
  };

  // Move step in pipeline
  const moveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === builderSteps.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...builderSteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBuilderSteps(updated);
  };

  // Save workflow
  const handleSaveWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflowTitle.trim() || builderSteps.length === 0) return;

    setIsSavingWorkflow(true);
    try {
      const toolIds = builderSteps.map((s) => s.id);
      await createWorkflow({
        title: workflowTitle,
        description: workflowDescription,
        toolIds
      });
      setBuilderSteps([]);
      await fetchData();
      setActiveTab("workflows");
    } catch (err) {
      console.error(err);
      alert("Failed to save workflow.");
    } finally {
      setIsSavingWorkflow(false);
    }
  };

  // Handle Delete Workflow
  const handleDeleteWorkflow = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    try {
      await deleteWorkflow(id);
      if (simulatingWorkflow?.id === id) {
        setSimulatingWorkflow(null);
        setSimStatus("idle");
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete workflow.");
    }
  };

  // Generate API Key
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsGenerating(true);
    setGeneratedKey(null);
    setCopiedKey(false);
    try {
      const res = await createApiKey(newKeyName);
      if (res) {
        setGeneratedKey(res.key);
        setNewKeyName("");
        await fetchData();
      } else {
        alert("Failed to generate API key.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Revoke API Key
  const handleRevokeApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? External agents using it will lose access immediately.")) return;
    try {
      const res = await revokeApiKey(id);
      if (res.success) {
        await fetchData();
      } else {
        alert("Failed to revoke API key.");
      }
    } catch (err) {
      console.error(err);
      alert("Error revoking API key.");
    }
  };

  // Copy helper
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <main className="relative h-screen overflow-hidden bg-background text-foreground transition-colors duration-500 flex flex-col">
      {/* Top Banner Gradient glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-72 bg-gradient-to-b from-blue-600/10 via-emerald-600/5 to-transparent rounded-full filter blur-[80px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-lg bg-zinc-900/70 border-b border-white/5 py-2.5 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-pink-500 via-blue-600 to-emerald-400 text-white flex items-center justify-center font-bold font-mono tracking-wider shadow-lg shadow-blue-500/10 select-none text-sm">
            ATM
          </div>
          <div className="text-left">
            <h1 className="font-bold text-xl md:text-2xl leading-none tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent select-none">
              Agent Tool Matrix
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-white/5 dark:bg-black/40 border border-white/10 rounded-xl p-1 font-sans text-sm">
          <button
            onClick={() => {
              setActiveTab("canvas");
              setSimulatingWorkflow(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "canvas"
                ? "bg-white/10 dark:bg-white/5 text-white border border-white/10 shadow"
                : "opacity-70 hover:opacity-100 text-foreground"
            }`}
          >
            <Compass className="w-4 h-4 text-pink-500" />
            <span>Canvas</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("builder");
              setSimulatingWorkflow(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "builder"
                ? "bg-white/10 dark:bg-white/5 text-white border border-white/10 shadow"
                : "opacity-70 hover:opacity-100 text-foreground"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Pipeline Builder</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("workflows");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "workflows"
                ? "bg-white/10 dark:bg-white/5 text-white border border-white/10 shadow"
                : "opacity-70 hover:opacity-100 text-foreground"
            }`}
          >
            <GitBranch className="w-4 h-4 text-emerald-500" />
            <span>Workflows</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("settings");
              setSimulatingWorkflow(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-white/10 dark:bg-white/5 text-white border border-white/10 shadow"
                : "opacity-70 hover:opacity-100 text-foreground"
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>

        {/* Actions / Theme */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleOpenCreate}
            disabled={userRole !== "Admin"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold text-sm shadow-lg shadow-blue-600/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tool</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 pt-3 md:pt-4 pb-1 md:pb-2 px-4 md:px-8 w-full overflow-hidden flex flex-col min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-sm font-mono opacity-70">Syncing with Neon cluster...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center gap-4 my-20">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-lg font-bold">Database Connection Error</h2>
            <p className="text-sm text-foreground/80 leading-relaxed font-mono">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold flex items-center gap-2 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Sync</span>
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "canvas" && (
              <CanvasTab
                filteredTools={filteredTools}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                userRole={userRole}
                handleOpenEdit={handleOpenEdit}
                handleDeleteTool={handleDeleteTool}
                addToPipeline={addToPipeline}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                searchQuery={searchQuery}
                directMatchIds={directMatchIds}
                relatedMatchIds={relatedMatchIds}
              />
            )}

            {activeTab === "builder" && (
              <BuilderTab
                tools={tools}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                builderSteps={builderSteps}
                setBuilderSteps={setBuilderSteps}
                workflowTitle={workflowTitle}
                setWorkflowTitle={setWorkflowTitle}
                workflowDescription={workflowDescription}
                setWorkflowDescription={setWorkflowDescription}
                isSavingWorkflow={isSavingWorkflow}
                handleSaveWorkflow={handleSaveWorkflow}
                moveStep={moveStep}
                removeFromPipeline={removeFromPipeline}
                addToPipeline={addToPipeline}
              />
            )}

            {activeTab === "workflows" && (
              <WorkflowsTab
                workflows={workflows}
                handleDeleteWorkflow={handleDeleteWorkflow}
                simulatingWorkflow={simulatingWorkflow}
                setSimulatingWorkflow={setSimulatingWorkflow}
                simStep={simStep}
                simLogs={simLogs}
                simStatus={simStatus}
                runSimulation={runSimulation}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                userRole={userRole}
                setUserRole={setUserRole}
                apiKeys={apiKeys}
                newKeyName={newKeyName}
                setNewKeyName={setNewKeyName}
                isGenerating={isGenerating}
                handleCreateApiKey={handleCreateApiKey}
                generatedKey={generatedKey}
                setGeneratedKey={setGeneratedKey}
                copiedKey={copiedKey}
                handleCopyKey={handleCopyKey}
                handleRevokeApiKey={handleRevokeApiKey}
                fetchData={fetchData}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      <ToolFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingTool={editingTool}
        onSubmit={handleFormSubmit}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formType={formType}
        setFormType={setFormType}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
        formMarkdown={formMarkdown}
        setFormMarkdown={setFormMarkdown}
        formTags={formTags}
        setFormTags={setFormTags}
        formSaving={formSaving}
      />

      <CartFab />
    </main>
  );
}
