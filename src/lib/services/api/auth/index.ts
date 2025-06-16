import { apiClientService } from '@/lib/services/api/client';
import { endpoints } from '@/lib/constants/endpoints';
import axios from 'axios';
import { AuthResponse, LogoutResponse } from '../../../../../interfaces/auth';

export const authService = {
  async forgotPassword(email: string) {
    const response = await apiClientService.post<{ message: string }>(
      `${endpoints.auth.base}${endpoints.auth.forgetPassword}`,
      { email }
    );
    return response;
  },

  async resetPassword(email: string, otp: string, password: string) {
    const response = await apiClientService.put<{ message: string }>(
      `${endpoints.auth.base}${endpoints.auth.resetPassword}`,
      {
        email,
        otp,
        password,
      }
    );
    return response;
  },

  async verifyOtp(email: string, otp: string) {
    const response = await apiClientService.post<{ message: string }>(
      `${endpoints.auth.base}${endpoints.auth.verifyOTP}`,
      { email, otp }
    );
    return response;
  },

  async loginOrSignup(email: string, name: string, password: string, authParam: string) {
    return axios.post<AuthResponse>(
      `${endpoints.base}${endpoints.auth.base}`,
      { email, name, password, authParam },
      {
        withCredentials: true,
      }
    );
  },
  async logout() {
    return axios.post<LogoutResponse>(
      `${endpoints.base}${endpoints.auth.base}${endpoints.auth.logout}`,
      {},
      {
        withCredentials: true,
      }
    );
  },
};
