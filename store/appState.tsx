import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  phoneNumber: string;
}

interface AppState {
  isLoggedIn: boolean;
  language: 'fa' | 'en' | null;
  user: User | null;
  setLanguage: (lang: 'fa' | 'en') => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      language: null,
      user: null,
      setLanguage: (lang) => set({ language: lang }),
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
