import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStateType, AuthResult } from '@/types/auth-type';
import { sendMassageAction, sendOtpAction } from '@/api/authApi';
import { TaskStatus } from '@/constants/TaskEnum';

export const useAppStore = create<AuthStateType>()(
  persist(
    (set, get) => ({
      isLogin: false,
      isLoading: false,
      language: 'en',
      user: null,
      token: null,
      hideTabBar: false,
      addInTimeTodoDrawer: false,
      isSendCode: false,
      calender: 'jalali',
      activeTab: TaskStatus.ALL,

      setIsSendCode: (isSendCode) => set({ isSendCode }),
      setHideTabBar: (bool) => set({ hideTabBar: bool }),
      setCalender: (calender) => set({ calender }),
      setAddInTimeTodoDrawer: (bool) => set({ addInTimeTodoDrawer: bool }),

      setLanguage: (lang) => {
        const state = get();
        if (state.user) {
          set({
            language: lang,
            user: { ...state.user, language: lang },
          });
        } else {
          set({ language: lang });
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setUserAndLanguage: (userid: string, username: string, lang: 'fa' | 'en') => {
        const state = get();
        if (state.user) {
          set({
            user: { ...state.user, id: userid, username, language: lang },
            language: lang,
          });
        } else {
          set({
            user: { id: userid, username, language: lang },
            language: lang,
          });
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isLogin: false,
          isSendCode: false,
        }),

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
        if (result.success && result.user && result.token) {
          set({
            isLogin: true,
            user: result.user,
            token: result.token,
          });
        }
        set({ isLoading: false });
        return result;
      },
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLogin: state.isLogin,
        language: state.language,
        calender: state.calender,
      }),
    },
  ),
);
