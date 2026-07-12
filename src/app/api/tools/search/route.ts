import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-api';

export async function GET(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json(
      { error: 'Missing query parameter "q"' },
      { status: 400 }
    );
  }

  try {
    const tools = await prisma.tool.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: [q.toLowerCase()] } }
        ]
      },
      select: {
        id: true,
        title: true,
        type: true,
        description: true,
        tags: true,
        // Intentionally omitting markdown_content to save bandwidth/tokens on list view
      },
      take: 20
    });

    return NextResponse.json({ results: tools });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during search' },
      { status: 500 }
    );
  }
}
