import { AuthResult } from '@/types/auth-type';
import api from '../baseApi';

export const sendMassageAction = async (identifier: string): Promise<AuthResult> => {
  try {
    const response = await api.post('auth/request-otp/', { identifier });

    if (response.status === 200) {
      return {
        success: true,
        status: response.data.status,
        message: response.data.message,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.error,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: 500,
        message: 'خطا در ارتباط با سرور',
      };
    }
    return {
      success: false,
      status: 500,
      message: 'خطای ناشناخته در ارتباط با سرور',
    };
  }
};

export const sendOtpAction = async (identifier: string, code: string): Promise<AuthResult> => {
  try {
    const response = await api.post('auth/verify-otp/', { identifier, code });
    if (response.status === 200) {
      return {
        success: true,
        status: response.data.status,
        message: response.data.message,
        user: response.data.user,
        token: response.data.token,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.error,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: 500,
        message: 'خطا در ارتباط با سرور',
      };
    }
    return {
      success: false,
      status: 500,
      message: 'خطای ناشناخته در ارتباط با سرور',
    };
  }
};
