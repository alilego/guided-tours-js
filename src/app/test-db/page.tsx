'use client';

import { useState, useEffect } from 'react';

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test-db');
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Failed to test database connection');
        } else {
          setResult(data);
        }
      } catch (err) {
        setError('Error testing database connection');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
          <p className="mb-2">
            <span className="font-medium">Connected:</span>{' '}
            {result.success ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-red-600">No</span>
            )}
          </p>
          
          <h2 className="text-xl font-semibold mb-2 mt-4">Users Table</h2>
          <p className="mb-2">
            <span className="font-medium">Exists:</span>{' '}
            {result.tableExists ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-red-600">No</span>
            )}
          </p>
          
          {result.usersError && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error accessing users table</p>
              <p><strong>Code:</strong> {result.usersError.code}</p>
              <p><strong>Message:</strong> {result.usersError.message}</p>
              {result.usersError.details && (
                <p><strong>Details:</strong> {result.usersError.details}</p>
              )}
            </div>
          )}
          
          {result.usersData && (
            <div>
              <h3 className="font-medium mb-2">Sample Users Data:</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(result.usersData, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-100 rounded">
            <h3 className="font-bold text-blue-800">Next Steps</h3>
            <p className="mt-2">
              If the users table doesn't exist or you're getting permission errors, you need to:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>Run the following SQL script:</li>
            </ol>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
{`-- Create users table if it doesn't exist
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
GRANT ALL ON public.users TO service_role;`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 