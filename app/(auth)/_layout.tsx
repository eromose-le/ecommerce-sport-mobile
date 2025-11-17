import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  // Default: show public stack (SignIn / SignUp / Splash)
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
