'use client';

import { useState } from 'react';

export default function TestConnectionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to test connection');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while testing the connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Supabase Connection</h1>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Connection Test Results</h2>
          
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Credentials</h3>
            <p>URL: {result.credentials.url}</p>
            <p>Key: {result.credentials.keyPrefix} (length: {result.credentials.keyLength})</p>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Authentication</h3>
            <p>Success: {result.auth.success ? 'Yes' : 'No'}</p>
            {result.auth.error && (
              <div className="mt-2 text-red-600">
                <p>Error: {result.auth.error.message}</p>
              </div>
            )}
            {result.auth.data && (
              <div className="mt-2">
                <p>User ID: {result.auth.data.user?.id || 'Not authenticated'}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Database Connection</h3>
            <p>Success: {result.database.success ? 'Yes' : 'No'}</p>
            {result.database.error && (
              <div className="mt-2 text-red-600">
                <p>Error: {result.database.error.message}</p>
              </div>
            )}
            {result.database.data && (
              <div className="mt-2">
                <p>{result.database.data}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips</h3>
            <ul className="list-disc pl-5 text-yellow-700">
              <li>Check that your environment variables are correctly set in your .env.local file</li>
              <li>Verify that your Supabase project is active and running</li>
              <li>Ensure your service role key has the necessary permissions</li>
              <li>Check your network connection and any firewall settings</li>
              <li>If the database test fails, you may need to create the necessary tables in Supabase</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 