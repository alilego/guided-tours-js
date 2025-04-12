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

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // First, check if the user exists in the 'users' table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking if user exists:', fetchError);
      return NextResponse.json(
        { error: 'Failed to check if user exists', details: fetchError },
        { status: 500 }
      );
    }

    let result;

    if (!existingUser) {
      // User doesn't exist, create a new user with ADMIN role
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: email,
            name: name || email.split('@')[0],
            role: 'ADMIN',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user', details: error },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // User exists, update their role to ADMIN
      const { data, error } = await supabase
        .from('users')
        .update({ role: 'ADMIN' })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
          { error: 'Failed to update user role', details: error },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in update-role route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 