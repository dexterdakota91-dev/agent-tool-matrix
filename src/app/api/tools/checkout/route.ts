import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-api';
export async function GET(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const singleId = searchParams.get('id');
  const multipleIdsStr = searchParams.get('ids');
  if (!singleId && !multipleIdsStr) {
    return NextResponse.json(
      { error: 'Missing query parameter "id" or "ids"' },
      { status: 400 }
    );
  }
  try {
    const isSingle = !!singleId;
    const ids = singleId ? [singleId] : multipleIdsStr!.split(',').filter(Boolean);
    const tools = await prisma.tool.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        title: true,
        markdownContent: true
      }
    });
    if (isSingle) {
      if (tools.length === 0) {
        return NextResponse.json(
          { error: 'Tool not found' },
          { status: 404 }
        );
      }
      return new NextResponse(tools[0].markdownContent || "", {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      const acceptHeader = request.headers.get('accept') || '';
      if (acceptHeader.includes('application/json')) {
        return NextResponse.json({
          count: tools.length,
          tools: tools.map(t => ({
            id: t.id,
            title: t.title,
            markdownContent: t.markdownContent || ""
          }))
        });
      } else {
        const combinedMarkdown = tools
          .map(t => `# ${t.title || 'Untitled'}\n\n${t.markdownContent || ""}`)
          .join('\n\n---\n\n');
        return new NextResponse(combinedMarkdown, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }
    }
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const toolIds = body.toolIds;
    if (!Array.isArray(toolIds) || toolIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid "toolIds" in request body' },
        { status: 400 }
      );
    }
    const tools = await prisma.tool.findMany({
      where: { id: { in: toolIds } },
      select: {
        id: true,
        title: true,
        markdownContent: true
      }
    });
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/plain')) {
      const combinedMarkdown = tools
        .map(t => `# ${t.title || 'Untitled'}\n\n${t.markdownContent || ""}`)
        .join('\n\n---\n\n');
      return new NextResponse(combinedMarkdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      return NextResponse.json({
        count: tools.length,
        tools: tools.map(t => ({
          id: t.id,
          title: t.title,
          markdownContent: t.markdownContent || ""
        }))
      });
    }
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}
