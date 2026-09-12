import { NextResponse } from 'next/server';

export async function GET() {
  const openapiSpec = {
    openapi: "3.1.0",
    info: {
      title: "Agent Tool Matrix API",
      version: "1.0.0",
      description: "API for the Agent Tool Matrix application."
    },
    servers: [
      {
        url: "/"
      }
    ],
    paths: {
      "/api/v1/tools": {
        get: {
          summary: "List all tools",
          description: "Retrieve a list of available tools.",
          responses: {
            "200": {
              description: "A list of tools."
            }
          }
        },
        post: {
          summary: "Create a tool",
          description: "Create a new tool entry.",
          security: [
            { BearerAuth: [] },
            { ApiKeyAuth: [] }
          ],
          responses: {
            "201": {
              description: "Tool created successfully."
            }
          }
        }
      },
      "/api/v1/workflows": {
        get: {
          summary: "List all workflows",
          description: "Retrieve a list of available workflows.",
          responses: {
            "200": {
              description: "A list of workflows."
            }
          }
        },
        post: {
          summary: "Create a workflow",
          description: "Create a new workflow entry.",
          security: [
            { BearerAuth: [] },
            { ApiKeyAuth: [] }
          ],
          responses: {
            "201": {
              description: "Workflow created successfully."
            }
          }
        }
      },
      "/api/tools/search": {
        get: {
          summary: "Search tools",
          description: "Search for tools using various parameters.",
          parameters: [
            {
              name: "q",
              in: "query",
              schema: { type: "string" },
              description: "Search query"
            },
            {
              name: "type",
              in: "query",
              schema: { type: "string" },
              description: "Tool type filter"
            },
            {
              name: "tag",
              in: "query",
              schema: { type: "string" },
              description: "Tool tag filter"
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
              description: "Page number"
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 10 },
              description: "Number of items per page"
            }
          ],
          responses: {
            "200": {
              description: "Search results."
            }
          }
        }
      },
      "/api/tools/checkout": {
        get: {
          summary: "Checkout tools (GET)",
          description: "Retrieve checkout details for specified tools.",
          parameters: [
            {
              name: "id",
              in: "query",
              schema: { type: "string" },
              description: "Single tool ID"
            },
            {
              name: "ids",
              in: "query",
              schema: { type: "string" },
              description: "Comma-separated list of tool IDs"
            }
          ],
          responses: {
            "200": {
              description: "Checkout details."
            }
          }
        },
        post: {
          summary: "Checkout tools (POST)",
          description: "Submit a list of tool IDs for checkout.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    toolIds: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["toolIds"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Checkout successful."
            }
          }
        }
      },
      "/api/mcp": {
        get: {
          summary: "MCP SSE Stream",
          description: "Establish a Server-Sent Events connection for MCP.",
          responses: {
            "200": {
              description: "SSE Stream connection established.",
              content: {
                "text/event-stream": {}
              }
            }
          }
        },
        post: {
          summary: "MCP JSON-RPC Endpoint",
          description: "Handle JSON-RPC 2.0 requests (e.g., tools/list, tools/call, prompts/list, prompts/get).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    jsonrpc: { type: "string", enum: ["2.0"] },
                    method: { type: "string" },
                    params: { type: "object" },
                    id: { type: ["string", "number"] }
                  },
                  required: ["jsonrpc", "method"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "JSON-RPC response."
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer"
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key"
        }
      }
    }
  };

  return NextResponse.json(openapiSpec);
}
