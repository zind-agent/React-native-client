import React from 'react';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { ModeType } from './types';

export function GluestackUIProvider({ mode = 'dark', ...props }: { mode?: ModeType; children?: React.ReactNode; style?: ViewProps['style'] }) {
  return (
    <View
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
