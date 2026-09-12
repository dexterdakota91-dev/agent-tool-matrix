import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-api';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const tagsParam = searchParams.get('tags');

  if (!q || q.trim() === '') {
    return NextResponse.json(
      { error: 'Missing query parameter "q"' },
      { status: 400 }
    );
  }

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const parsedLimit = limitParam ? parseInt(limitParam, 10) : 20;
  const limit = Math.min(50, Math.max(1, parsedLimit));
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.ToolWhereInput = {
      OR: [
        { title: { contains: q.trim(), mode: 'insensitive' } },
        { description: { contains: q.trim(), mode: 'insensitive' } },
        { tags: { hasSome: [q.trim().toLowerCase()] } }
      ]
    };

    if (tagsParam) {
      const tagList = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
      if (tagList.length > 0) {
        where.tags = { hasSome: tagList };
      }
    }

    const [total, tools] = await Promise.all([
      prisma.tool.count({ where }),
      prisma.tool.findMany({
        where,
        select: {
          id: true,
          title: true,
          type: true,
          description: true,
          tags: true,
          // Intentionally omitting markdown_content to save bandwidth/tokens on list view
        },
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({
      results: tools,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during search' },
      { status: 500 }
    );
  }
}
