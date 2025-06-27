import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { hstackStyle } from './styles';
import { useStaticDynamicStyle } from '@/hooks/useDynamicStyle';

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ElementRef<typeof View>, IHStackProps>(
  ({ className, style, space, reversed, ...props }, ref) => {
    const dirStyle = useStaticDynamicStyle(style);

    return (
      <View
        className={hstackStyle({ space, reversed, class: className })}
        {...props}
        ref={ref}
        style={dirStyle}
      />
    );
  },
);

HStack.displayName = 'HStack';
export { HStack };
