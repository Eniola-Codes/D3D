import axios from 'axios';

// Create axios instance with basic config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple API service with basic methods
export const apiService = {
  // GET request
  get: async <T>(url: string) => {
    const response = await api.get<T>(url);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any) => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any) => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};
