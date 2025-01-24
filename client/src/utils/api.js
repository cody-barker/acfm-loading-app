const API_URL = 'http://localhost:3001/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const ensureLeadingSlash = (endpoint) => {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${ensureLeadingSlash(endpoint)}`, {
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${ensureLeadingSlash(endpoint)}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}${ensureLeadingSlash(endpoint)}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${ensureLeadingSlash(endpoint)}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
  },
};
