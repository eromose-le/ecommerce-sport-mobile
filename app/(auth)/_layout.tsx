import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TABS_PROTECTED, TABS_PUBLIC } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  const { user, skippedLogin, loading } = useAuth();

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <AppLoader />
      </View>
    );
  }

  if (user) return <Redirect href={TABS_PROTECTED} />;

  if (skippedLogin) return <Redirect href={TABS_PUBLIC} />;

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="on-boarding" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </ErrorBoundary>
  );
}
