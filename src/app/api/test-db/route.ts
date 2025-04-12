import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    // Test 1: Check if we can connect to Supabase by querying the users table directly
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    // If we get a permission error, it means the table exists but we don't have access
    // If we get a "relation does not exist" error, it means the table doesn't exist
    const tableExists = !usersError || 
      (usersError && usersError.code !== '42P01'); // 42P01 is "relation does not exist"
    
    return NextResponse.json({
      success: true,
      tableExists,
      usersData,
      usersError: usersError ? {
        code: usersError.code,
        message: usersError.message,
        details: usersError.details
      } : null
    });
  } catch (error) {
    console.error('Error in test-db route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 