import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 500000,
  // headers: {
  //   Accept: 'application/json',
  //   "Content-Type": "multipart/form-data",
  // },
});

// Add a request interceptor

instance.interceptors.request.use((config) => {
  const token = Cookies.get("adminToken");

  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});



const responseBody = (response) => response.data;

const requests = {
  get: (url) => instance.get(url).then(responseBody),

  post: (url, body, config = {}) =>
    instance.post(url, body, config).then(responseBody),

  put: (url, body, config = {}) =>
    instance.put(url, body, config).then(responseBody),

  delete: (url) => instance.delete(url).then(responseBody),
};



// const responseBody = (response) => response.data;

// const requests = {
//   get: (url, body, headers) =>
//     instance.get(url, body, headers).then(responseBody),

//   post: (url, body, config = {}) =>
//     instance.post(url, body, config).then(responseBody),


//   put: (url, body, headers) =>
//     instance.put(url, body, headers).then(responseBody),

//   patch: (url, body) => instance.patch(url, body).then(responseBody),

//   delete: (url) => instance.delete(url).then(responseBody),
// };

export default requests;
