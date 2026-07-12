"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Database, Trash2, CheckCircle2, Terminal } from "lucide-react";
import { ApiKey as DbApiKey } from "@/app/actions";

interface SettingsTabProps {
  userRole: "Admin" | "Guest";
  setUserRole: (role: "Admin" | "Guest") => void;
  apiKeys: DbApiKey[];
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  isGenerating: boolean;
  handleCreateApiKey: (e: React.FormEvent) => Promise<void>;
  generatedKey: string | null;
  setGeneratedKey: (key: string | null) => void;
  copiedKey: boolean;
  handleCopyKey: (key: string) => void;
  handleRevokeApiKey: (id: string) => Promise<void>;
  fetchData: () => Promise<void>;
}

export function SettingsTab({
  userRole,
  setUserRole,
  apiKeys,
  newKeyName,
  setNewKeyName,
  isGenerating,
  handleCreateApiKey,
  generatedKey,
  copiedKey,
  handleCopyKey,
  handleRevokeApiKey
}: SettingsTabProps) {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md space-y-8 text-left h-full overflow-y-auto pr-2 scrollbar-thin"
    >
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-lg font-bold tracking-tight">ATM Settings & Connection Panel</h2>
        <p className="text-xs opacity-60">Audit Neon credentials and customize agent access tiers.</p>
      </div>

      {/* Identity Toggle */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Access Tier Control</span>
        </h3>

        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold">Simulator User Identity</div>
            <p className="text-[11px] opacity-70 mt-0.5">Toggle admin privilege locks to simulate authorization gates.</p>
          </div>

          <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 font-mono text-xs">
            <button
              onClick={() => setUserRole("Admin")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                userRole === "Admin" ? "bg-blue-600 text-white shadow" : "opacity-60 hover:opacity-100 text-foreground"
              }`}
            >
              Administrator
            </button>
            <button
              onClick={() => setUserRole("Guest")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                userRole === "Guest" ? "bg-zinc-800 text-white shadow" : "opacity-60 hover:opacity-100 text-foreground"
              }`}
            >
              Guest (Read-Only)
            </button>
          </div>
        </div>
      </div>

      {/* Database Endpoint Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Neon Serverless Connectivity</span>
        </h3>

        <div className="space-y-3 font-mono text-xs text-left">
          <div className="space-y-1">
            <span className="text-[10px] uppercase opacity-60">Neon Cluster Host</span>
            <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-emerald-300 select-all truncate text-xs">
              ep-sweet-sky-ahc8utpw-pooler.c-3.us-east-1.aws.neon.tech
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase opacity-60">Database User</span>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-zinc-300">
                neondb_owner
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase opacity-60">Database Engine</span>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-zinc-300">
                PostgreSQL 16 (Serverless)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Access Control / API Key Management */}
      <div className="space-y-6 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-pink-500" />
          <h3 className="text-sm font-semibold">Agent Access Tiers & Tokens</h3>
        </div>

        {/* Dev static token display */}
        <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2.5">
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Static Development Token</span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">Use this token for local agent client development and debugging.</p>
          </div>
          <div className="flex gap-2">
            <code className="flex-grow p-2.5 rounded-lg bg-black/30 border border-white/5 text-blue-300 select-all truncate text-xs font-mono">
              dev_static_key_12345
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText("dev_static_key_12345");
                alert("Static token copied!");
              }}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold select-none text-white"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Create key section */}
        <form onSubmit={handleCreateApiKey} className="space-y-3.5">
          <div>
            <div className="text-xs font-bold">Register External Agent Credentials</div>
            <p className="text-[11px] opacity-75 mt-0.5">Generate a secure database-backed Bearer API key for production integrations.</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Claude Code Subagent"
              disabled={isGenerating || userRole !== "Admin"}
              required
              className="flex-grow text-xs p-2.5 rounded-xl border border-white/10 bg-black/20 outline-none focus:border-pink-500 transition-colors text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isGenerating || !newKeyName.trim() || userRole !== "Admin"}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-xs active:scale-95 disabled:opacity-50 transition-all duration-200"
            >
              {isGenerating ? "Generating..." : "Generate Key"}
            </button>
          </div>
        </form>

        {/* Success modal/alert for new key */}
        {generatedKey && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">API Key Generated Successfully!</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Copy this key now. For your security, **it will not be shown again** once you leave or refresh this page.
            </p>
            <div className="flex gap-2">
              <code className="flex-grow p-2.5 rounded-lg bg-black/30 border border-white/10 text-emerald-300 select-all truncate text-xs font-mono">
                {generatedKey}
              </code>
              <button
                onClick={() => handleCopyKey(generatedKey)}
                className="px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold text-emerald-300"
              >
                {copiedKey ? "Copied!" : "Copy Key"}
              </button>
            </div>
          </div>
        )}

        {/* Registered key list */}
        <div className="space-y-3">
          <div className="text-xs font-bold">Active Integrations ({apiKeys.length})</div>

          {apiKeys.length === 0 ? (
            <div className="text-center py-6 bg-black/10 rounded-xl border border-white/5 text-[11px] opacity-60">
              No active custom keys registered.
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/10 border border-white/5 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-white">{key.name}</div>
                    <div className="flex items-center gap-3 text-[10px] opacity-75 font-mono">
                      <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                        {key.prefix}••••••••
                      </span>
                      <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeApiKey(key.id)}
                    disabled={userRole !== "Admin"}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-30 disabled:hover:bg-red-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
