type Headers = Record<string, string>;

export const getAuthHeaders = (): Headers => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getDefaultHeaders = (): Headers => {
  return {
    'Content-Type': 'application/json',
  };
};

export const combineHeaders = (...headers: Headers[]): Headers => {
  return headers.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}; 