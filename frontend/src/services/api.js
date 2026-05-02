import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')).token 
      : null;
    if (token) {
      console.log('API Request: Found token in localStorage, adding to headers');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('API Request: No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
