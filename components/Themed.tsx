import { Text as DefaultText, View as DefaultView } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';

type ColorName = {
  [K in keyof (typeof Colors)['light']]: (typeof Colors)['light'][K] extends string ? K : never;
}[keyof (typeof Colors)['light']];

type ThemeProps = {
  lightColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(props: { light?: string }, colorName: ColorName) {
  const theme = 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor }, 'text');
  const { language } = useAppStore();

  return (
    <DefaultText
      style={[{ color, fontFamily: language === 'fa' ? 'DanaBold' : 'Nunito' }, style]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor }, 'surface');
  const { language } = useAppStore();

  return (
    <DefaultView
      style={[{ backgroundColor, direction: language === 'fa' ? 'rtl' : 'ltr' }, style]}
      {...otherProps}
    />
  );
}
