'use client';

import { useState } from 'react';

export default function CreateTablePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkTable = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/create-table');
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to check table');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Error checking table');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Users Table</h1>
      
      <button
        onClick={checkTable}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Checking...' : 'Check Users Table'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          {result.tableExists ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">Success</p>
              <p>The users table already exists.</p>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p className="font-bold">Table Not Found</p>
              <p>The users table does not exist. Please create it manually using the SQL Editor in the Supabase dashboard.</p>
            </div>
          )}
          
          {result.sqlScript && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">SQL Script</h2>
              <p className="mb-2">Copy and paste the following SQL script into the SQL Editor in your Supabase dashboard:</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {result.sqlScript}
              </pre>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Log in to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase dashboard</a></li>
                  <li>Select your project</li>
                  <li>Go to the SQL Editor</li>
                  <li>Create a new query</li>
                  <li>Copy and paste the SQL script above</li>
                  <li>Run the query</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
        <p>After creating the table, you can:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Visit the <a href="/test-db" className="text-blue-500 hover:underline">Database Test</a> page to verify the table was created</li>
          <li>Sign out and sign back in to refresh your session</li>
          <li>Visit the <a href="/admin/update-role" className="text-blue-500 hover:underline">Update Role</a> page to update your role to ADMIN</li>
        </ol>
      </div>
    </div>
  );
} 