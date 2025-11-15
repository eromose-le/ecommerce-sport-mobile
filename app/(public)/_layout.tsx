import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/providers/auth";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import "../global.css";

export default function PublicLayout() {
  const { user, loading, skippedLogin } = useAuth();
  console.log("(PUBLIC) _layout ==::", { user, loading, skippedLogin });

  // Show loader while auth state is loading
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Navigate automatically if logged in or skipped
  if (user) {
    return <Redirect href="/(protected)/(tabs-protected)" />;
  }

  if (skippedLogin) {
    return <Redirect href="/(public)/(tabs-public)" />;
  }

  // Default: show public stack (SignIn / SignUp / Splash)
  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
