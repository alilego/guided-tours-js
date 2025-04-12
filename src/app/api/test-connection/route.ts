import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing Supabase credentials',
          details: {
            url: supabaseUrl ? 'Set' : 'Missing',
            key: supabaseServiceKey ? 'Set' : 'Missing'
          }
        },
        { status: 500 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test basic connection by getting the current user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    // Test database connection by querying a table
    // We'll use a simple query that should work even if tables don't exist yet
    const { data: dbData, error: dbError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);
    
    // Return connection test results
    return NextResponse.json({
      success: true,
      message: 'Connection test completed',
      credentials: {
        url: supabaseUrl,
        keyPrefix: supabaseServiceKey.substring(0, 10) + '...',
        keyLength: supabaseServiceKey.length
      },
      auth: {
        success: !authError,
        error: authError,
        data: authData
      },
      database: {
        success: !dbError,
        error: dbError,
        data: dbData ? 'Database connection successful' : 'No data returned'
      }
    });
  } catch (error: any) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test connection',
        details: {
          message: error.message,
          code: error.code,
          hint: error.hint
        }
      },
      { status: 500 }
    );
  }
} 