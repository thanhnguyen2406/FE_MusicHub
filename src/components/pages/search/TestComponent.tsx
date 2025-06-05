import React from 'react';
import { useTestQuery } from '../../../rsocket/helpers';

const TestComponent: React.FC = () => {
  const { data, error, isLoading } = useTestQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1>Test Component</h1>
      <p>Data from RSocket: {data.data}</p>
    </div>
  );
};

export default TestComponent; 