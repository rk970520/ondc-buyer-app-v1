import axios from 'axios';

export const identityClient = axios.create({
  baseURL: import.meta.env.VITE_IDENTITY_URL || '/auth-api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buyerDataClient = axios.create({
  baseURL: import.meta.env.VITE_BUYER_DATA_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buyerAppClient = axios.create({
  baseURL: import.meta.env.VITE_BUYER_APP_URL || '/app-api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for auth token
const authInterceptor = (config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

identityClient.interceptors.request.use(authInterceptor);
buyerDataClient.interceptors.request.use(authInterceptor);
buyerAppClient.interceptors.request.use(authInterceptor);
