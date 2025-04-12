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
    // Check if the users table exists
    const { data: existingTable, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    // If we get a "relation does not exist" error, it means the table doesn't exist
    const tableExists = !checkError || 
      (checkError && checkError.code !== '42P01'); // 42P01 is "relation does not exist"
    
    if (tableExists) {
      return NextResponse.json({ 
        success: true, 
        message: 'Users table already exists',
        tableExists: true
      });
    }
    
    // Since we can't create tables directly through the Supabase client,
    // we'll provide instructions for the user to create the table manually
    return NextResponse.json({ 
      success: true, 
      message: 'Users table does not exist. Please create it manually using the SQL Editor in the Supabase dashboard.',
      tableExists: false,
      sqlScript: `
-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'USER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for testing purposes
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Grant permissions to the service role
GRANT ALL ON public.users TO service_role;
      `
    });
  } catch (error) {
    console.error('Error in create-table route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 