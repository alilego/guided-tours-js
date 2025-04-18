import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Revalidate the path
    revalidatePath(path);

    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating path' },
      { status: 500 }
    );
  }
} 