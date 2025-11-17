import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  // Default: show public stack (SignIn / SignUp / OnBoarding)
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="on-boarding" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
    </Stack>
  );
}
