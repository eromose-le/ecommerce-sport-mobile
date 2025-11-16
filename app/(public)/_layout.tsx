import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/providers/auth";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import "../global.css";
import { TABS_PROTECTED } from "@/constants/urls";

export default function PublicLayout() {
  const { user, loading } = useAuth();
  console.log("(PUBLIC) _layout ==::", { user, loading });

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
    return <Redirect href={TABS_PROTECTED} />;
  }

  // Default: show public stack (SignIn / SignUp / Splash)
  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
