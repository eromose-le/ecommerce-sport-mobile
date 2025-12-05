import AppLoader from "@/components/common/AppLoader";
import AppOfflineNoticeBanner from "@/components/common/AppOfflineNoticeBanner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { toastConfig } from "@/components/common/ToastConfig";
import { AuthProvider } from "@/providers/auth";
import { PaystackProvider } from "@/providers/paystack";
import { QueryProvider } from "@/providers/query";
import { ThemeProvider, useTheme, useThemedStyles } from "@/providers/theme";
import { Logger } from "@/utils/logger";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
  useFonts,
} from "@expo-google-fonts/jost";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import ToastManager from "toastify-react-native";
import "./global.css";

if (Platform.OS !== "web") {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

function RootContent() {
  const { isDark } = useTheme();
  const theme = useThemedStyles();
  usePushNotifications();
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
  });

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!fontsLoaded || !isMounted) return;

      setReady(true);

      if (Platform.OS !== "web") {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          Logger.error("Splash hide error", e);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [fontsLoaded]);

  const statusBarStyle = isDark ? "light" : "dark";
  const offlineNotice = <AppOfflineNoticeBanner />;

  if (!ready) {
    return (
      <View className={`items-center justify-center flex-1 ${theme.pageBg}`}>
        <AppLoader />
        <StatusBar style={statusBarStyle} />
        {offlineNotice}
      </View>
    );
  }

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Slot />
      {offlineNotice}
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PaystackProvider>
          <QueryProvider>
            <AuthProvider>
              <RootContent />
              <ToastManager config={toastConfig} />
            </AuthProvider>
          </QueryProvider>
        </PaystackProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
