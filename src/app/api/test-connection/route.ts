import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VersionResult {
  version: string;
}

export async function GET() {
  try {
    // Test Prisma connection
    try {
      await prisma.$connect();
      const result = await prisma.$queryRaw<VersionResult[]>`SELECT version()`;
      
      return NextResponse.json({
        success: true,
        database: {
          type: 'postgresql',
          version: result[0]?.version || 'unknown',
          connected: true
        }
      });
    } catch (prismaError) {
      console.error('Prisma connection error:', prismaError);
      return NextResponse.json(
        { 
          error: 'Failed to connect to database',
          details: prismaError instanceof Error ? prismaError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 