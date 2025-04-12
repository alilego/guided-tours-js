import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      return NextResponse.json(
        { 
          error: 'Missing Supabase credentials',
          details: {
            missingUrl: !supabaseUrl,
            missingServiceKey: !supabaseServiceKey
          }
        },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test connection by getting server version
    const { data: versionData, error: versionError } = await supabase
      .rpc('version');

    if (versionError) {
      console.error('Supabase connection error:', {
        message: versionError.message,
        code: versionError.code,
        details: versionError.details,
        hint: versionError.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to connect to Supabase',
          details: {
            message: versionError.message,
            code: versionError.code,
            hint: versionError.hint
          }
        },
        { status: 500 }
      );
    }

    // Fetch users from the database
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', {
        message: usersError.message,
        code: usersError.code,
        details: usersError.details,
        hint: usersError.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch users',
          details: {
            message: usersError.message,
            code: usersError.code,
            hint: usersError.hint
          }
        },
        { status: 500 }
      );
    }

    // Return success response with users data
    return NextResponse.json({
      success: true,
      users,
      connection: {
        version: versionData
      }
    });

  } catch (error: unknown) {
    console.error('Unexpected error in users API:', error);
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 