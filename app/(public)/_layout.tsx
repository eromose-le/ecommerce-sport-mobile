import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/providers/auth";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function PublicLayout() {
  const { user, loading } = useAuth();

  // Wait until auth is loaded
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user is logged in → redirect to protected tabs
  if (user) {
    return <Redirect href="/(protected)/(tabs-protected)" />;
  }

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
