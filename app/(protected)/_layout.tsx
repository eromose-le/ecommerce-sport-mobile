import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/providers/auth";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function ProtectedLayout() {
  const { user, loading, skippedLogin } = useAuth();
  console.log("(PROTECTED) _layout ==::", { user, loading, skippedLogin });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (skippedLogin) {
    return <Redirect href="/(public)/(tabs-public)" />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
