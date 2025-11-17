import { Slot } from "expo-router";
import { AuthProvider, useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";
import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
  useFonts,
} from "@expo-google-fonts/jost";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { QueryProvider } from "@/providers/query";
import ToastManager from "toastify-react-native";
import { toastConfig } from "@/components/common/ToastConfig";

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
        <ActivityIndicator size="small" />
        <StatusBar style="dark" />
      </View>
    );
  }

  console.log("(APP _content) ==::", { fontsLoaded, appIsReady, loading });
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  console.log("(APP _LAYOUT) ==::");
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
