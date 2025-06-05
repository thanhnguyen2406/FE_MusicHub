import React, { useState } from 'react';
import { rsocketRequestStream } from '../../../rsocket/helpers';
import { useTestQuery } from '../../../rsocket/helpers';

interface TestResponse {
  data: string;
}

interface StreamResponse {
  message: string;
}

const Search: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(false);
  
  const { data: testRSocket, isLoading } = useTestQuery(undefined, {
    skip: !trigger
  });

  const handleTest = async () => {
    try {
      console.log('Starting RSocket request-response test...');
      setError(null);
      setStreamData([]);
      setTrigger(true);
      
      if (testRSocket) {
        console.log('Request-Response data:', testRSocket);
        setResponse(testRSocket.data);
      }
    } catch (err) {
      console.error('Request-Response error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResponse(null);
    }
  };

  const testRSocketStream = async (
    onNext: (data: StreamResponse) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    try {
      await rsocketRequestStream(
        'route',
        { message: 'request msg' },
        onNext,
        onComplete,
        onError
      );
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  const handleTestStream = async () => {
    try {
      setError(null);
      setResponse(null);
      setStreamData([]);
      await testRSocketStream(
        (data: StreamResponse) => {
          console.log('Stream data:', data);
          setStreamData((prev) => [...prev, data.message]);
        },
        () => {
          console.log('Stream completed');
          setResponse('Stream completed');
        },
        (err: Error) => {
          console.error('Stream error:', err);
          setError(err.message);
        }
      );
    } catch (err) {
      console.error('Stream error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RSocket Test</h1>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleTest}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Test RSocket (Request-Response)
          </button>
          <button
            onClick={handleTestStream}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Test RSocket (Stream)
          </button>
        </div>
        {response && (
          <div className="p-4 bg-green-500/20 rounded border border-green-500 mt-4">
            <h3 className="font-medium mb-2">Response:</h3>
            <p>{response}</p>
          </div>
        )}
        {streamData.length > 0 && (
          <div className="p-4 bg-blue-500/20 rounded border border-blue-500 mt-4">
            <h3 className="font-medium mb-2">Stream Data:</h3>
            <ul>
              {streamData.map((data, index) => (
                <li key={index}>{data}</li>
              ))}
            </ul>
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