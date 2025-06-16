import axios, { AxiosInstance } from 'axios';
import { AUTH_TOKEN } from '@/lib/constants';
import { getCookie } from 'cookies-next';

export const createApiService = (): AxiosInstance => {
  const token = getCookie(AUTH_TOKEN) as string | undefined;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const apiClientService = {
  get: async <T>(url: string): Promise<T> => {
    const response = await createApiService().get<T>(url);
    return response.data;
  },
  post: async <TResponse, TRequest = unknown>(url: string, data: TRequest): Promise<TResponse> => {
    const response = await createApiService().post<TResponse>(url, data);
    return response.data;
  },
  put: async <TResponse, TRequest = unknown>(url: string, data: TRequest): Promise<TResponse> => {
    const response = await createApiService().put<TResponse>(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await createApiService().delete<T>(url);
    return response.data;
  },
};
