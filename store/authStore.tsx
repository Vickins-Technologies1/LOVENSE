// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        toast.success('Logged in successfully!', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'light',
        });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        document.cookie = 'token=; Max-Age=0; path=/'; // Clear token cookie
        toast.info('Logged out successfully!', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'light',
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);