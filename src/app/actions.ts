"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface Tool {
  id: string;
  title: string;
  type: "prompt" | "skill" | "mcp";
  description: string | null;
  markdownContent: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTool {
  workflowId: string;
  toolId: string;
  stepOrder: number;
  toolTitle?: string;
  toolType?: "prompt" | "skill" | "mcp";
}

export interface Workflow {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  tools?: WorkflowTool[];
}

export async function getTools(): Promise<Tool[]> {
  try {
    const rows = await prisma.tool.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      type: r.type,
      description: r.description,
      markdownContent: r.markdownContent,
      tags: r.tags || [],
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to get tools:", error);
    return [];
  }
}

export async function createTool(data: {
  title: string;
  type: "prompt" | "skill" | "mcp";
  description: string;
  markdownContent: string;
  tags: string[];
}): Promise<Tool | null> {
  try {
    const r = await prisma.tool.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description,
        markdownContent: data.markdownContent,
        tags: data.tags
      }
    });
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      description: r.description,
      markdownContent: r.markdownContent,
      tags: r.tags || [],
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Failed to create tool:", error);
    return null;
  }
}

export async function updateTool(
  id: string,
  data: {
    title: string;
    type: "prompt" | "skill" | "mcp";
    description: string;
    markdownContent: string;
    tags: string[];
  }
): Promise<Tool | null> {
  try {
    const r = await prisma.tool.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        description: data.description,
        markdownContent: data.markdownContent,
        tags: data.tags
      }
    });
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      description: r.description,
      markdownContent: r.markdownContent,
      tags: r.tags || [],
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Failed to update tool:", error);
    return null;
  }
}

export async function deleteTool(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.tool.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tool:", error);
    return { success: false };
  }
}

export async function getWorkflows(): Promise<Workflow[]> {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        tools: {
          orderBy: { stepOrder: "asc" },
          include: {
            tool: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    return workflows.map(w => ({
      id: w.id,
      title: w.title,
      description: w.description,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
      tools: w.tools.map(wt => ({
        workflowId: wt.workflowId,
        toolId: wt.toolId,
        stepOrder: wt.stepOrder,
        toolTitle: wt.tool.title,
        toolType: wt.tool.type,
      })),
    }));
  } catch (error) {
    console.error("Failed to get workflows:", error);
    return [];
  }
}

export async function createWorkflow(data: {
  title: string;
  description: string;
  toolIds: string[];
}): Promise<Workflow | null> {
  try {
    const newWorkflow = await prisma.$transaction(async (tx) => {
      const wf = await tx.workflow.create({
        data: {
          title: data.title,
          description: data.description || null,
        }
      });

      if (data.toolIds && data.toolIds.length > 0) {
        await tx.workflowTool.createMany({
          data: data.toolIds.map((toolId, index) => ({
            workflowId: wf.id,
            toolId,
            stepOrder: index + 1
          }))
        });
      }

      return wf;
    });

    return {
      id: newWorkflow.id,
      title: newWorkflow.title,
      description: newWorkflow.description,
      createdAt: newWorkflow.createdAt.toISOString(),
      updatedAt: newWorkflow.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Failed to create workflow:", error);
    return null;
  }
}

export async function deleteWorkflow(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.workflow.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete workflow:", error);
    return { success: false };
  }
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  active: boolean;
}

export async function getApiKeys(): Promise<ApiKey[]> {
  try {
    const rows = await prisma.apiKey.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      prefix: r.prefix,
      createdAt: r.createdAt.toISOString(),
      lastUsed: r.lastUsed ? r.lastUsed.toISOString() : null,
      active: r.active,
    }));
  } catch (error) {
    console.error("Failed to get API keys:", error);
    return [];
  }
}

export async function createApiKey(name: string): Promise<{ key: string; apiKey: ApiKey } | null> {
  try {
    // Generate a random key with "atm_" prefix
    const rawKey = `atm_${crypto.randomBytes(24).toString("hex")}`;
    const prefix = rawKey.substring(0, 8); // e.g. "atm_a1b2"
    const hash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const r = await prisma.apiKey.create({
      data: {
        name,
        hash,
        prefix,
        active: true
      }
    });
    return {
      key: rawKey,
      apiKey: {
        id: r.id,
        name: r.name,
        prefix: r.prefix,
        createdAt: r.createdAt.toISOString(),
        lastUsed: null,
        active: r.active,
      }
    };
  } catch (error) {
    console.error("Failed to create API key:", error);
    return null;
  }
}

export async function revokeApiKey(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.apiKey.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    return { success: false };
  }
}

export interface InitialData {
  tools: Tool[];
  workflows: Workflow[];
  apiKeys: ApiKey[];
}

export async function getInitialData(): Promise<InitialData> {
  try {
    const [tools, workflows, apiKeys] = await Promise.all([
      getTools(),
      getWorkflows(),
      getApiKeys()
    ]);
    return { tools, workflows, apiKeys };
  } catch (error) {
    console.error("Failed to get initial data:", error);
    return { tools: [], workflows: [], apiKeys: [] };
  }
}

