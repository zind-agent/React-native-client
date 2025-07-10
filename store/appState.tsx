import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStateType, AuthResult } from '@/types/auth-type';
import { sendMassageAction, sendOtpAction } from '@/api/authApi';

export const useAppStore = create<AuthStateType>()(
  persist(
    (set) => ({
      isLogin: false,
      isLoading: false,
      language: null,
      user: null,
      token: null,
      hideTabBar: false,
      addInTimeTodoDrawer: false,
      isSendCode: false,
      calender: 'jalali',
      setIsSendCode: (isSendCode) => set({ isSendCode }),
      setHideTabBar: (bool) => set({ hideTabBar: bool }),
      setCalender: (calender) => set({ calender }),
      setAddInTimeTodoDrawer: (bool) => set({ addInTimeTodoDrawer: bool }),

      setLanguage: (lang) => set({ language: lang }),
      logout: () => set({ user: null, isLogin: false }),

      sendMassage: async (identifier: string): Promise<AuthResult> => {
        set({ isLoading: true });
        const result = await sendMassageAction(identifier);
        if (result.success) {
          set({ isSendCode: true });
        }
        set({ isLoading: false });
        return result;
      },

      sendOtp: async (identifier: string, code: string): Promise<AuthResult> => {
        set({ isLoading: true });
        const result = await sendOtpAction(identifier, code);
        if (result.success) {
          set({ isLogin: true, user: result.user, token: result.token });
        }
        set({ isLoading: false });
        return result;
      },
    }),

    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, language: state.language, isLogin: state.isLogin }),
    },
  ),
);
