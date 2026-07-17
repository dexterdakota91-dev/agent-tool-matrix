import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/auth-api";
import crypto from "crypto";

// In-memory store for active SSE client connections (works for local development and single-server environments)
const clients = new Map<string, ReadableStreamDefaultController>();

// Utility to normalize tool title to a valid MCP tool name (alphanumeric, underscores, hyphens)
function normalizeName(title: string): string {
  return title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}

export async function GET(request: Request) {
  // 1. Authenticate connection
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const url = new URL(request.url);
  const connectionId = url.searchParams.get("connectionId") || crypto.randomUUID();

  // Create stream to maintain active connection
  const stream = new ReadableStream({
    start(controller) {
      clients.set(connectionId, controller);

      // Send the connection endpoint response event to the client
      const endpointMsg = "event: endpoint\ndata: " + url.pathname + "?connectionId=" + connectionId + "\n\n";
      controller.enqueue(new TextEncoder().encode(endpointMsg));

      console.log("[MCP] Client connected: " + connectionId);
    },
    cancel() {
      clients.delete(connectionId);
      console.log("[MCP] Client disconnected: " + connectionId);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no" // Disable buffering for Vercel/Nginx
    }
  });
}

export async function POST(request: Request) {
  // 1. Authenticate request
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const connectionId = url.searchParams.get("connectionId");
  if (!connectionId) {
    return NextResponse.json({ error: "Missing connectionId" }, { status: 400 });
  }

  const controller = clients.get(connectionId);
  if (!controller) {
    return NextResponse.json({ error: "Connection expired or not found" }, { status: 404 });
  }

  let body: { method: string; params?: { uri?: string; name?: string; arguments?: Record<string, unknown> }; id?: string | number | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON-RPC request" }, { status: 400 });
  }

  const { method, params, id } = body;

  // Background processing of the MCP request
  processMcpRequest(method, params, id)
    .then((responseJson) => {
      const message = "event: message\ndata: " + JSON.stringify(responseJson) + "\n\n";
      try {
        controller.enqueue(new TextEncoder().encode(message));
      } catch (err) {
        console.error("[MCP] Failed to send message to client " + connectionId + ":", err);
        clients.delete(connectionId);
      }
    })
    .catch((err) => {
      console.error("[MCP] Error processing request:", err);
      const errorResponse = {
        jsonrpc: "2.0",
        id,
        error: { code: -32603, message: err.message || "Internal error" }
      };
      const message = "event: message\ndata: " + JSON.stringify(errorResponse) + "\n\n";
      try {
        controller.enqueue(new TextEncoder().encode(message));
      } catch {}
    });

  // Acknowledge receipt of POST (MCP SSE transport response code is 202/200)
  return new Response("Accepted", { status: 202 });
}

// Process the JSON-RPC request and build response payloads
interface McpParams {
  uri?: string;
  name?: string;
  arguments?: Record<string, unknown>;
}

function handleInitialize(id: string | number | null | undefined): Record<string, unknown> {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      },
      serverInfo: {
        name: "Agent Tool Matrix (ATM)",
        version: "1.0.0"
      }
    }
  };
}

async function processMcpRequest(
  method: string,
  params: McpParams | undefined,
  id: string | number | null | undefined
): Promise<Record<string, unknown>> {

  switch (method) {
    case "initialize":
      return handleInitialize(id);

    case "tools/list":
      try {
        // Fetch all tools from database
        const dbTools = await prisma.tool.findMany();

        // Expose prompt and connector tools as executable schemas (or skills run locally)
        const mcpTools = dbTools.map((tool) => ({
          name: normalizeName(tool.title),
          description: tool.description || "Execute " + tool.title + " from Agent Tool Matrix.",
          inputSchema: {
            type: "object",
            properties: tool.type === "prompt"
              ? {
                  input: {
                    type: "string",
                    description: "Prompt insertion context or query arguments."
                  }
                }
              : {},
            required: []
          }
        }));

        return {
          jsonrpc: "2.0",
          id,
          result: { tools: mcpTools }
        };
      } catch (error) {
        throw new Error("Failed to query tools: " + (error as Error).message);
      }

    case "tools/call":
      try {
        const name = params?.name;
        if (!name) throw new Error("Missing tool name");
        const args = params?.arguments || {};

        const dbTools = await prisma.tool.findMany();
        const tool = dbTools.find(t => normalizeName(t.title) === name);
        if (!tool) throw new Error("Tool not found");

        let responseText = tool.markdownContent || "";
        if (tool.type === "prompt" && args.input) {
          // If the prompt has a placeholder, interpolate it
          if (responseText.includes("{{input}}")) {
            responseText = responseText.replace(/\{\{input\}\}/g, String(args.input));
          } else {
            responseText = responseText + "\n\nInput Context:\n" + String(args.input);
          }
        }

        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: responseText
              }
            ]
          }
        };
      } catch (error) {
        throw new Error("Failed to call tool: " + (error as Error).message);
      }

    case "resources/list":
      try {
        const dbTools = await prisma.tool.findMany();

        // Expose Prompt & Skill files as resources for ingestion
        const mcpResources = dbTools
          .filter(t => t.type === "skill" || t.type === "prompt")
          .map((tool) => ({
            uri: "atm://tools/" + tool.id,
            name: tool.title,
            description: tool.description || "Raw source for " + tool.title,
            mimeType: tool.type === "skill" ? "application/javascript" : "text/markdown"
          }));

        return {
          jsonrpc: "2.0",
          id,
          result: { resources: mcpResources }
        };
      } catch (error) {
        throw new Error("Failed to query resources: " + (error as Error).message);
      }

    case "resources/read":
      try {
        const uri = params?.uri;
        if (!uri) throw new Error("Missing resource uri");

        const idMatch = uri.match(/atm:\/\/tools\/(.+)/);
        const toolId = idMatch ? idMatch[1] : null;
        if (!toolId) throw new Error("Invalid resource uri format");

        const tool = await prisma.tool.findUnique({
          where: { id: toolId }
        });

        if (!tool) throw new Error("Tool resource not found");

        return {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: tool.type === "skill" ? "application/javascript" : "text/markdown",
                text: tool.markdownContent || ""
              }
            ]
          }
        };
      } catch (error) {
        throw new Error("Failed to read resource: " + (error as Error).message);
      }

    case "prompts/list":
      try {
        const dbTools = await prisma.tool.findMany({
          where: { type: "prompt" }
        });

        const mcpPrompts = dbTools.map((tool) => ({
          name: normalizeName(tool.title),
          description: tool.description || "Prompt template: " + tool.title,
          arguments: [
            {
              name: "input",
              description: "Custom parameters to replace inside the prompt template.",
              required: false
            }
          ]
        }));

        return {
          jsonrpc: "2.0",
          id,
          result: { prompts: mcpPrompts }
        };
      } catch (error) {
        throw new Error("Failed to list prompts: " + (error as Error).message);
      }

    case "prompts/get":
      try {
        const name = params?.name;
        if (!name) throw new Error("Missing prompt name");

        const dbTools = await prisma.tool.findMany({
          where: { type: "prompt" }
        });

        const tool = dbTools.find(t => normalizeName(t.title) === name);
        if (!tool) throw new Error("Prompt not found");

        return {
          jsonrpc: "2.0",
          id,
          result: {
            description: tool.description || "",
            messages: [
              {
                role: "user",
                content: {
                  type: "text",
                  text: tool.markdownContent || ""
                }
              }
            ]
          }
        };
      } catch (error) {
        throw new Error("Failed to fetch prompt: " + (error as Error).message);
      }

    default:
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method " + method + " not found" }
      };
  }
}
