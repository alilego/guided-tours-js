-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'USER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies to allow service role to access the table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to read all users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Service role can read all users'
  ) THEN
    CREATE POLICY "Service role can read all users" 
      ON public.users 
      FOR SELECT 
      TO service_role 
      USING (true);
  END IF;
END
$$;

-- Create policy to allow service role to insert users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Service role can insert users'
  ) THEN
    CREATE POLICY "Service role can insert users" 
      ON public.users 
      FOR INSERT 
      TO service_role 
      WITH CHECK (true);
  END IF;
END
$$;

-- Create policy to allow service role to update users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Service role can update users'
  ) THEN
    CREATE POLICY "Service role can update users" 
      ON public.users 
      FOR UPDATE 
      TO service_role 
      USING (true);
  END IF;
END
$$;

-- Create policy to allow service role to delete users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Service role can delete users'
  ) THEN
    CREATE POLICY "Service role can delete users" 
      ON public.users 
      FOR DELETE 
      TO service_role 
      USING (true);
  END IF;
END
$$;

-- Grant permissions to the service role
GRANT ALL ON public.users TO service_role; 