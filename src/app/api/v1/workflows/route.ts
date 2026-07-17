import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/auth-api";

export async function GET(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error("Failed to fetch workflows API:", error);
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
      description?: string;
      toolIds: string[];
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, description, toolIds } = body;

    if (!title || !toolIds || !Array.isArray(toolIds)) {
      return NextResponse.json({ error: "Missing required fields: title and toolIds array" }, { status: 400 });
    }

    // Verify all toolIds exist in database
    const existingTools = await prisma.tool.findMany({
      where: {
        id: { in: toolIds }
      }
    });

    const existingIds = new Set(existingTools.map(t => t.id));
    const allExist = toolIds.every(id => existingIds.has(id));

    if (!allExist) {
      return NextResponse.json({ error: "One or more tool IDs do not exist in the database" }, { status: 400 });
    }

    // Create workflow and link tools within a transaction
    const newWorkflow = await prisma.$transaction(async (tx) => {
      const wf = await tx.workflow.create({
        data: {
          title,
          description: description || null,
        }
      });

      if (toolIds.length > 0) {
        await tx.workflowTool.createMany({
          data: toolIds.map((toolId, index) => ({
            workflowId: wf.id,
            toolId,
            stepOrder: index + 1
          }))
        });
      }

      return wf;
    });

    // Fetch the created workflow with its tools to return
    const workflowWithTools = await prisma.workflow.findUnique({
      where: { id: newWorkflow.id },
      include: {
        tools: {
          orderBy: { stepOrder: "asc" },
          include: {
            tool: true
          }
        }
      }
    });

    return NextResponse.json({ workflow: workflowWithTools }, { status: 201 });
  } catch (error) {
    console.error("Failed to create workflow API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
