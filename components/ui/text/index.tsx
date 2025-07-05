import React from 'react';

import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { Text as RNText } from 'react-native';
import { textStyle } from './styles';
import { useDynamicFont } from '@/hooks/useDynamicFont';

type ITextProps = React.ComponentProps<typeof RNText> & VariantProps<typeof textStyle>;

const Text = React.forwardRef<React.ElementRef<typeof RNText>, ITextProps>(({ className, style, isTruncated, bold, underline, strikeThrough, size = 'md', sub, italic, highlight, ...props }, ref) => {
  const fontStyle = useDynamicFont(style);
  return (
    <RNText
      style={fontStyle}
      className={textStyle({
        isTruncated,
        bold,
        underline,
        strikeThrough,
        size,
        sub,
        italic,
        highlight,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

Text.displayName = 'Text';

export { Text };
