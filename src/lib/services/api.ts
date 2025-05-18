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
  post: async <TResponse, TRequest = unknown>(url: string, data: TRequest): Promise<TResponse> => {
    const response = await api.post<TResponse>(url, data);
    return response.data;
  },

  // PUT request
  put: async <TResponse, TRequest = unknown>(url: string, data: TRequest): Promise<TResponse> => {
    const response = await api.put<TResponse>(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};
