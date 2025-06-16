import axios, { AxiosInstance } from 'axios';
import { AUTH_TOKEN } from '@/lib/constants';
import { cookies } from 'next/headers';

export const createApiService = async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN)?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const apiServerService = {
  get: async <T>(url: string): Promise<T> => {
    const api = await createApiService();
    const response = await api.get<T>(url);
    return response.data;
  },

  post: async <TResponse, TRequest = unknown>(url: string, data: TRequest): Promise<TResponse> => {
    const api = await createApiService();
    const response = await api.post<TResponse>(url, data);
    return response.data;
  },

  put: async <TResponse, TRequest = unknown>(url: string, data: TRequest): Promise<TResponse> => {
    const api = await createApiService();
    const response = await api.put<TResponse>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const api = await createApiService();
    const response = await api.delete<T>(url);
    return response.data;
  },
};
