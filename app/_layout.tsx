import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Slot } from 'expo-router';
import '../i18n';

import '../global.css';
import Loading from '@/components/shared/Loading';
import { LanguageGate } from '@/constants/LanguageGate';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoItalic: require('../assets/fonts/Nunito-Italic-VariableFont_wght.ttf'),
    Nunito: require('../assets/fonts/Nunito-Regular.ttf'),
    NunitoBold: require('../assets/fonts/Nunito-ExtraBold.ttf'),
    DanaMedium: require('../assets/fonts/medium.ttf'),
    DanaBold: require('../assets/fonts/bold.ttf'),
    DanaReguler: require('../assets/fonts/regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) return <Loading />;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <LanguageGate>
      <GluestackUIProvider>
        <Slot />
      </GluestackUIProvider>
    </LanguageGate>
  );
}
