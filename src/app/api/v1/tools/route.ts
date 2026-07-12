import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, ToolType } from "@prisma/client";
import { validateApiKey } from "@/lib/auth-api";

export async function GET(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const tag = url.searchParams.get("tag");

  try {
    const where: Prisma.ToolWhereInput = {};
    if (type) {
      if (type === "prompt" || type === "skill" || type === "mcp") {
        where.type = type as ToolType;
      }
    }
    if (tag) {
      where.tags = { has: tag };
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Failed to fetch tools API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body: {
      title: string;
      type: "prompt" | "skill" | "mcp";
      description?: string;
      markdownContent?: string;
      tags?: string[];
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, type, description, markdownContent, tags } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Missing required fields: title and type" }, { status: 400 });
    }

    if (type !== "prompt" && type !== "skill" && type !== "mcp") {
      return NextResponse.json({ error: "Invalid tool type. Must be 'prompt', 'skill', or 'mcp'" }, { status: 400 });
    }

    const newTool = await prisma.tool.create({
      data: {
        title,
        type: type as ToolType,
        description: description || null,
        markdownContent: markdownContent || null,
        tags: tags || [],
      },
    });

    return NextResponse.json({ tool: newTool }, { status: 201 });
  } catch (error) {
    console.error("Failed to create tool API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
