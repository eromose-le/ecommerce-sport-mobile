import { useAppState } from "@/hooks/useAppState";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Logger } from "@/utils/logger";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const appState = useAppState();
  const userState = useAuthUser();

  Logger.warn("LAYOUT", "(AUTH) ==::", { appState, userState });

  // Default: show public stack (SignIn / SignUp / OnBoarding)
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="on-boarding" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
