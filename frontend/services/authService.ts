import apiClient from '@/lib/apiClient';
import { ApiResponse, AuthResponse } from '@/types';
import { LoginFormData, RegisterFormData } from '@/lib/validators';

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },
};
