import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { toastConfig } from "@/components/common/ToastConfig";
import { AppEnv } from "@/constants/env";
import { AuthProvider, useAuth } from "@/providers/auth";
import { QueryProvider } from "@/providers/query";
import { Logger } from "@/utils/logger";
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
import { View } from "react-native";
import ToastManager from "toastify-react-native";
import "./global.css";

SplashScreen.preventAutoHideAsync();

function RootContent() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
  });
  const { loading } = useAuth();

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded && !loading) {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded, loading]);

  if (!fontsLoaded || loading || !appIsReady) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <AppLoader />
        <StatusBar style="dark" />
      </View>
    );
  }

  Logger.warn("(APP _content) ==::", {
    fontsLoaded,
    appIsReady,
    loading,
    env: AppEnv,
  });
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  Logger.warn("(APP _LAYOUT) ==::");
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <RootContent />
          <ToastManager config={toastConfig} />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
