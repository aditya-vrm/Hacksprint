import axios from 'axios';

let baseURL = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD) {
  baseURL = 'https://hacksprint-n0uc.onrender.com/api';
} else {
  baseURL = baseURL || '/api';
  if (baseURL.startsWith('http') && !baseURL.endsWith('/api')) {
    baseURL = `${baseURL.replace(/\/$/, '')}/api`;
  }
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
