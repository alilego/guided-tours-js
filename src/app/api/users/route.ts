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
        hasKey: !!supabaseServiceKey
      });
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, test the connection
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    if (versionError) {
      console.error('Error testing connection:', versionError);
      return NextResponse.json(
        { error: 'Failed to connect to Supabase', details: versionError },
        { status: 500 }
      );
    }

    // Fetch users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, "createdAt"')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching users:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch users',
          details: {
            message: error.message,
            code: error.code,
            hint: error.hint
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      connection: {
        version: versionData
      }
    });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
} 