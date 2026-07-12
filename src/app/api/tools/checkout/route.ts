import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateApiKey } from '@/lib/auth-api';

export async function GET(request: Request) {
  const isAuthorized = await validateApiKey(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing query parameter "id"' },
      { status: 400 }
    );
  }

  try {
    const tool = await prisma.tool.findUnique({
      where: { id },
      select: {
        markdownContent: true
      }
    });

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Returns ONLY the raw markdown content as plain text, saving token overhead for AI agents
    return new NextResponse(tool.markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}
