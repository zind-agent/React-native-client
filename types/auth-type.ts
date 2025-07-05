export interface User {
  id: number;
  email: string;
  phone_number: string | null;
  is_verified: boolean;
  language: string;
  level: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  status?: number;
  token?: string;
}

export interface AuthStateType {
  isLogin: boolean;
  isLoading: boolean;
  isSendCode: boolean;
  language: 'fa' | 'en' | null;
  token: string | null;
  user: User | null;
  calender: 'jalali' | 'gregorian';
  setLanguage: (lang: 'fa' | 'en') => void;
  logout: () => void;
  hideTabBar: boolean;
  setHideTabBar: (bool: boolean) => void;
  sendMassage: (identifier: string) => Promise<AuthResult>;
  sendOtp: (identifier: string, code: string) => Promise<AuthResult>;
  setIsSendCode: (bool: boolean) => void;
  setCalender: (calender: 'jalali' | 'gregorian') => void;
}
