import { Colors } from '@/constants/Colors';
import { Toast, ToastTitle, useToast } from '../ui/toast';
import { useCallback } from 'react';

export const useShowToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (message: string, action: 'success' | 'error' | 'warning' | 'info' = 'info') => {
      const getBgColor = () => {
        switch (action) {
          case 'error':
            return Colors.light.accent;
          case 'success':
            return Colors.light.tag.work;
          case 'warning':
            return Colors.light.warning;
          case 'info':
            return Colors.light.info;
          default:
            return Colors.light.primary;
        }
      };

      const bgColorToast = getBgColor();

      return toast.show({
        placement: 'top',
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={id} action={action} variant="solid" style={{ backgroundColor: bgColorToast }}>
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        ),
      });
    },
    [toast],
  );

  return showToast;
};
