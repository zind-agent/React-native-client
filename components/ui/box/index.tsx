import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { boxStyle } from './styles';
import { useAppStore } from '@/store/appState';

type IBoxProps = ViewProps &
  VariantProps<typeof boxStyle> & {
    className?: string;
    style?: StyleProp<ViewStyle>;
  };

const Box = React.forwardRef<React.ElementRef<typeof View>, IBoxProps>(
  ({ className, style, ...props }, ref) => {

    const { language } = useAppStore()
    return (
      <View ref={ref} {...props} className={boxStyle({ class: className })}
        style={[{ direction: language === 'fa' ? 'rtl' : 'ltr' }, style]}
      />
    );
  }
);

Box.displayName = 'Box';
export { Box };
