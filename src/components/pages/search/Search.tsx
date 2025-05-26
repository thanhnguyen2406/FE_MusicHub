import React, { useState } from 'react';
import { rsocketService } from '../../../rsocket/apis';

async function testRSocket() {
  try {
    const response = await rsocketService.requestResponse("channel.getMyChannel", {});
    console.log('RSocket response:', response);
    return response;
  } catch (error) {
    console.error('RSocket error:', error);
    throw error;
  }
}

const Search: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    try {
      setError(null);
      const result = await testRSocket();
      console.log('Final result:', result);
      setResponse(typeof result === 'string' ? result : JSON.stringify(result));
    } catch (err) {
      console.error('Final error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResponse(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RSocket Test</h1>
        <button
          onClick={handleTest}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Test RSocket
        </button>
        {response && (
          <div className="p-4 bg-green-500/20 rounded border border-green-500 mt-4">
            <h3 className="font-medium mb-2">Response:</h3>
            <p>{response}</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-500/20 rounded border border-red-500 mt-4">
            <h3 className="font-medium mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 