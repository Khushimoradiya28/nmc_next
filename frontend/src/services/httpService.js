const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const requests = {
  get: async (url, params = {}) => {
    let fullUrl = `${API_BASE_URL}${url}`;
    const query = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });

    const queryString = query.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store'
    });

    return handleResponse(response);
  },

  post: async (url, body) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: isFormData ? {} : {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: isFormData ? body : JSON.stringify(body),
    });

    return handleResponse(response);
  }
};

export default requests;
