import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { boxStyle } from './styles';
import { useStaticDynamicStyle } from '@/hooks/useDynamicStyle';

type IBoxProps = ViewProps &
  VariantProps<typeof boxStyle> & {
    className?: string;
    style?: StyleProp<ViewStyle>;
  };

const Box = React.forwardRef<React.ElementRef<typeof View>, IBoxProps>(({ className, style, ...props }, ref) => {
  const dirStyle = useStaticDynamicStyle(style);
  return <View ref={ref} {...props} className={boxStyle({ class: className })} style={dirStyle} />;
});

Box.displayName = 'Box';
export { Box };
