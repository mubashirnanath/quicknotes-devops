'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { LoginFormData, RegisterFormData } from '@/lib/validators';
import toast from 'react-hot-toast';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      router.push('/notes');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({ name: data.name, email: data.email, password: data.password }),
    onSuccess: (result) => {
      setAuth(result.user, result.token);
      router.push('/notes');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });
}
