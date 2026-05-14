'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
        if (typeof document !== 'undefined') {
          document.cookie = `qn-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof document !== 'undefined') {
          document.cookie = 'qn-token=; path=/; max-age=0';
        }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'quicknotes-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
