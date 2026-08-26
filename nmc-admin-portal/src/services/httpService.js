import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  const token = Cookies.get("adminToken");

  if (config.data instanceof FormData) {
    // Let browser set the correct multipart/form-data boundary header
    delete config.headers['Content-Type'];
  }

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});




const responseBody = (response) => response.data;

const requests = {
  get: (url, params, headers = {}) =>
    instance.get(url, { params, headers }).then(responseBody),

  post: (url, body, headers = {}) =>
    instance.post(url, body, { headers }).then(responseBody),

  put: (url, body, headers = {}) =>
    instance.put(url, body, { headers }).then(responseBody),

  patch: (url, body, headers = {}) =>
    instance.patch(url, body, { headers }).then(responseBody),

  delete: (url, config) => instance.delete(url, config).then(responseBody),
};



export default requests;
