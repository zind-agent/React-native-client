import FontAwesome from "@expo/vector-icons/FontAwesome";
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Slot } from "expo-router";
import '../i18n'

import "../global.css";
import Loading from "@/components/shared/Loading";

export {
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    RobotoMono: require("../assets/fonts/RobotoMono-VariableFont_wght.ttf"),
    RobotoMonoItalic: require("../assets/fonts/RobotoMono-Italic-VariableFont_wght.ttf"),
    DanaMedium: require("../assets/fonts/medium.ttf"),
    DanaBold: require("../assets/fonts/bold.ttf"),
    DanaReguler: require("../assets/fonts/regular.ttf"),
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
    <GluestackUIProvider>
      <Slot />
    </GluestackUIProvider>
  );
}
