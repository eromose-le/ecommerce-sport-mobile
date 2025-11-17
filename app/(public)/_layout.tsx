import AppLoader from "@/components/common/AppLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { TABS_PROTECTED } from "@/constants/urls";
import { useAuth } from "@/providers/auth";
import { Logger } from "@/utils/logger";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function PublicLayout() {
  const { user, loading } = useAuth();
  Logger.warn("(PUBLIC) _layout ==::", { user, loading });

  // Show loader while auth state is loading
  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <AppLoader />
      </View>
    );
  }

  // Navigate automatically if logged in or skipped
  if (user) {
    return <Redirect href={TABS_PROTECTED} />;
  }

  // Default: show public stack (SignIn / SignUp / Splash)
  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
