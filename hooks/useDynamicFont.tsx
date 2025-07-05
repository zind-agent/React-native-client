import { useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useAppStore } from '@/store/appState';

type DynamicTextStyle = StyleProp<TextStyle>;

export function useDynamicFont(style?: DynamicTextStyle): DynamicTextStyle {
  const { language } = useAppStore();

  const fontStyle: TextStyle = {
    fontFamily: language === 'fa' ? 'DanaMedium' : 'IBMPRegular',
  };

  const computedStyle = useMemo(() => {
    return [fontStyle, style] as DynamicTextStyle;
  }, [language, style]);

  return computedStyle;
}
